import React, { useState } from 'react';
import { User, Course } from './types';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import CourseViewer from './components/CourseViewer';
import CourseGenerator from './components/CourseGenerator';

const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Advanced Machine Learning',
    description: 'Dive deep into neural networks, deep learning, and advanced AI architectures with practical implementations.',
    duration: '8 Weeks',
    level: 'Advanced',
    modules: ['Neural Networks Basics', 'Convolutional Networks', 'RNNs and LSTMs', 'Transformers & Attention', 'Deployment Strategies']
  },
  {
    id: 'c2',
    title: 'Functional React Patterns',
    description: 'Learn modern React development using hooks, suspense, and functional composition for scalable apps.',
    duration: '4 Weeks',
    level: 'Intermediate',
    modules: ['Hooks Deep Dive', 'Custom Hooks', 'Context & State Management', 'Performance Optimization']
  },
  {
    id: 'c3',
    title: 'Introduction to Rust',
    description: 'A beginner-friendly curriculum for learning memory safety, ownership, and systems programming in Rust.',
    duration: '6 Weeks',
    level: 'Beginner',
    modules: ['Syntax & Basics', 'Ownership & Borrowing', 'Structs & Enums', 'Error Handling', 'Concurrency']
  }
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  
  // Pages: 'dashboard', 'catalog', 'generator', 'viewer'
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);

  // Add loading and error states for the login process
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);


  const BASE_URL_SIGN_IN = 'https://corsproxy.io/https://fusion-ai-api.medifus.dev/webhooks/webhook-8414c9a8-3042-4e21-96ad-756a8cc0c49f/auth/sign-in';
  const BASE_URL_SIGN_UP = 'https://corsproxy.io/https://fusion-ai-api.medifus.dev/webhooks/webhook-t9tapeqa3evztcmu799cg2a1/auth/sign-up';

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
  

  const handleGenerateCourse = (newCourse: Course) => {
    setCourses([newCourse, ...courses]);
    if (user) {
      setUser({
        ...user,
        enrolledCourses: [newCourse.id, ...user.enrolledCourses],
        progress: { ...user.progress, [newCourse.id]: 0 }
      });
    }
    setViewingCourseId(newCourse.id);
    setCurrentPage('viewer');
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
      
      {currentPage === 'catalog' && (
        <Catalog 
          courses={courses}
          user={user}
          onViewCourse={(id) => {
            setViewingCourseId(id);
            setCurrentPage('viewer');
          }}
        />
      )}
      
      {currentPage === 'generator' && (
        <CourseGenerator onCourseGenerated={handleGenerateCourse} />
      )}
      
      {currentPage === 'viewer' && viewingCourseId && (
        <CourseViewer 
          course={courses.find(c => c.id === viewingCourseId)!}
          progress={user.progress[viewingCourseId] || 0}
          onBack={() => setCurrentPage('dashboard')}
          onUpdateProgress={(prog) => handleUpdateProgress(viewingCourseId, prog)}
        />
      )}
    </Layout>
  );
}
