import React from 'react';
import { Course, User } from '../types';
import { Plus, Check, Clock, BookOpen } from 'lucide-react';

interface CatalogProps {
  courses: Course[];
  onViewCourse: (courseId: string) => void;
}

export default function Catalog({ courses, onViewCourse }: CatalogProps) {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Course Catalog</h1>
        <p className="text-slate-500">Explore AI-generated curriculums tailored for cutting-edge skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          
          return (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                    {course.level}
                  </span>
                </div>
                <h3 className="font-bold text-xl leading-snug mb-3">{course.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-6">{course.description}</p>
                
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{course.modules.length} Modules</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-0">
                  <button 
                    onClick={() => onViewCourse(course.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Go to Course
                  </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
