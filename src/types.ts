export interface User {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[]; // course IDs
  progress: Record<string, number>; // courseId -> progress percentage
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: string[];
  duration: string;
  level: string;
}
