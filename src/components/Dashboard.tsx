import React from 'react';
import { User, Course } from '../types';
import { BookOpen, Trophy, Clock, Target } from 'lucide-react';

interface DashboardProps {
  user: User;
  courses: Course[];
  onContinueCourse: (courseId: string) => void;
}

export default function Dashboard({ user, courses, onContinueCourse }: DashboardProps) {
  
  const overallProgress = courses.length > 0 
    ? Math.round(courses.reduce((acc, course) => acc + (user.progress[course.id] || 0), 0) / courses.length)
    : 0;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-sm text-slate-500">You have new lessons to complete today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled</span>
          </div>
          <div className="text-2xl font-bold">{courses.length}</div>
          <p className="text-sm text-slate-400 mt-2">Active courses</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-4">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Overall</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{overallProgress}%</div>
          <p className="text-sm text-slate-400 mt-2">Average completion</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Target className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Weekly Goal</span>
            </div>
            <span className="text-2xl font-bold text-indigo-600">4 / 5 Days</span>
          </div>
          <div className="flex gap-2 h-14 mt-auto">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-between">
                <div className={`w-3 h-3 rounded-full ${i < 4 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                <span className="text-xs font-semibold text-slate-400">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex justify-between items-center">
          Current Progress
        </h2>
        
        {courses.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No active courses</h3>
            <p className="text-slate-500 mb-6">You haven't enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progress = course.progress * 100 / course.chapters.length || 0;
              return (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer" onClick={() => onContinueCourse(course.id)}>
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-lg">
                        Beginner
                      </span>
                      <span className="flex items-center text-xs text-slate-500 font-medium ml-auto">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {course.duration}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg leading-snug mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{course.description}</p>
                  </div>
                  
                  <div className="px-6 pb-6 pt-0">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
                      <span className="font-bold text-slate-900">Progress</span>
                      <span className="font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <button 
                      className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onContinueCourse(course.id);
                      }}
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
