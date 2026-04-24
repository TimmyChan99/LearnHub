import React, { useState, useEffect } from 'react';
import { User, Course } from './types';
import { supabase } from './supabase.ts'; // Assuming your Supabase client is exported from here
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import CourseViewer from './components/CourseViewer';
import CourseGenerator from './components/CourseGenerator';

// Remove INITIAL_COURSES as we'll fetch from Supabase
// const INITIAL_COURSES: Course[] = [...]; // Commented out or removed

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true); // New state for loading courses
  
  // Pages: 'dashboard', 'catalog', 'generator', 'viewer'
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);

  // Add loading and error states for the login process
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Add loading state for course generation
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);

  const BASE_URL_SIGN_IN = 'https://corsproxy.io/https://fusion-ai-api.medifus.dev/webhooks/webhook-8414c9a8-3042-4e21-96ad-756a8cc0c49f/auth/sign-in';
  const BASE_URL_SIGN_UP = 'https://corsproxy.io/https://fusion-ai-api.medifus.dev/webhooks/webhook-t9tapeqa3evztcmu799cg2a1/auth/sign-up';

  // Function to fetch courses and their chapters from Supabase
  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      // Fetch all courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');

        console.log('Fetched courses:', coursesData);
      if (coursesError) throw coursesError;

      // For each course, fetch its chapters
      const coursesWithChapters = await Promise.all(
        coursesData.map(async (course) => {
          const { data: chapters, error: chaptersError } = await supabase
            .from('chapitres')
            .select('*')
            .eq('course_id', course.id);

          if (chaptersError) throw chaptersError;

          return { ...course, chapters: chapters || [] }; // Attach chapters to the course
        })
      );

      console.log('Courses with chapters:', coursesWithChapters);
      setCourses(coursesWithChapters);
    } catch (error) {
      console.error('Error fetching courses and chapters:', error);
      // Optionally, set an error state here if needed
    } finally {
      setCoursesLoading(false);
    }
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  /**
   * Unified auth handler for both Login and Sign Up
   */
  const handleAuth = async (credentials: any, isSignUp: boolean = false) => {
    setIsLoading(true);
    setLoginError(null);

    // Determine which endpoint to hit
    const endpoint = isSignUp ? BASE_URL_SIGN_UP : BASE_URL_SIGN_IN;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // Try to parse server error message, fallback to generic error
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`);
      }

      const userData: User = await response.json();
      
      // Update state with the user data from the server
      setUser(userData);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error(`${isSignUp ? 'Sign up' : 'Login'} failed:`, error);
      setLoginError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleGenerateCourse = async (title: string) => {
    setIsGeneratingCourse(true);
    try {
      const response = await fetch('https://corsproxy.io/https://fusion-ai-api.medifus.dev/webhooks/webhook-szumbo1v862q3omhvcxxfyl1/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate course');
      }

      const newCourse: Course = await response.json();

      // Add the new course to the courses state
      setCourses([newCourse, ...courses]);

      // Update user progress if user is logged in
      if (user) {
        setUser({
          ...user,
          progress: { ...user.progress, [newCourse.id]: 0 }
        });
      }

      // Navigate to the course viewer
      setViewingCourseId(newCourse.id);
      setCurrentPage('viewer');
    } catch (error) {
      console.error('Error generating course:', error);
      // set an error state for course generation here 
    } finally {
      setIsGeneratingCourse(false);
    }
  };

  const handleUpdateProgress = (courseId: string, progress: number) => {
    if (!user) return;
    setUser({
      ...user,
      progress: {
        ...user.progress,
        [courseId]: progress
      }
    });
  };

  if (!user) {
    return <Auth onLogin={handleAuth} isLoading={isLoading} loginError={loginError} />;
  }

  // Show loading indicator while fetching courses
  if (coursesLoading) {
    return <div>Loading courses...</div>; 
  }

  return (
    <Layout 
      user={user} 
      currentPage={currentPage} 
      onNavigate={(page) => setCurrentPage(page)}
      onLogout={() => setUser(null)}
    >
      {currentPage === 'dashboard' && (
        <Dashboard 
          user={user} 
          courses={courses}
          onContinueCourse={(id) => {
            setViewingCourseId(id);
            setCurrentPage('viewer');
          }}
        />
      )}
      
      {currentPage === 'catalog' && viewingCourseId && (
        <Catalog 
          courses={courses}
          onViewCourse={(id) => {
            setViewingCourseId(id);
            setCurrentPage('viewer');
          }}
        />
      )}
      
      {currentPage === 'generator' && (
        <CourseGenerator onCourseGenerated={handleGenerateCourse} isGenerating={isGeneratingCourse} />
      )}
      
      {currentPage === 'viewer' && viewingCourseId && (
        <CourseViewer 
          course={courses.find(c => c.id === viewingCourseId)!}
          progress={courses.find(c => c.id === viewingCourseId)?.progress * 100 / courses.find(c => c.id === viewingCourseId)?.chapters.length || 0}
          onBack={() => setCurrentPage('dashboard')}
          onUpdateProgress={(prog) => handleUpdateProgress(viewingCourseId, prog)}
        />
      )}
    </Layout>
  );
}
