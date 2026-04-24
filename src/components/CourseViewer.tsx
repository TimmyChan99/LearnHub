import React, { useState } from 'react';
import { Course } from '../types';
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText } from 'lucide-react';

interface CourseViewerProps {
  course: Course;
  progress: number;
  onBack: () => void;
  onUpdateProgress: (newProgress: number) => void;
}

export default function CourseViewer({ course, progress, onBack, onUpdateProgress }: CourseViewerProps) {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const chapters = course.chapters || [];
  const hasChapters = chapters?.length > 0;
  const activeChapter = hasChapters ? chapters[activeModuleIndex] : null;

  // Function to mark a chapter as completed by sending a request to the API
  const markChapterCompleted = async (chapterId: string) => {
    try {
      const response = await fetch('https://corsproxy.io/https://fusion-ai-api.medifus.dev/webhooks/webhook-p2o8weuycaynh3bhnb2i3ab5/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: chapterId }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark chapter as completed');
      }

      console.log('Chapter marked as completed:', chapterId);
    } catch (error) {
      console.error('Error marking chapter as completed:', error);
    }
  };

  const handleCompleteModule = async () => {
    if (!hasChapters) return;

    // Mark the current chapter as completed
    const currentChapterId = activeChapter?.id;
    if (currentChapterId) {
      await markChapterCompleted(currentChapterId);
    }

    if (activeModuleIndex < chapters?.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
    }

    const newProgress = Math.min(100, Math.round(((activeModuleIndex + 1) / chapters?.length) * 100));
    onUpdateProgress(newProgress);
  };

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar / Syllabus */}
      <div className="w-80 border-r border-slate-200 flex flex-col pt-6 bg-white">
        <div className="px-6 mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>

          <h2 className="font-bold text-lg leading-snug mb-2">{course.title}</h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-slate-500">{progress}%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          {hasChapters ? (
            chapters.map((mod, index) => {
              const isActive = index === activeModuleIndex;
              const isCompleted = index < activeModuleIndex || progress === 100;

              return (
                <button
                  key={index}
                  onClick={() => setActiveModuleIndex(index)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                    isActive ? 'bg-indigo-50 shadow-sm border border-indigo-100 text-indigo-900' : 'hover:bg-slate-50 border border-transparent text-slate-600'
                  }`}
                >
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : isActive ? (
                      <PlayCircle className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isActive ? 'text-indigo-900' : 'text-slate-600'}`}>
                      Module {index + 1}
                    </p>
                    <p className={`text-xs mt-1 line-clamp-2 ${isActive ? 'text-indigo-700/80' : 'text-slate-500'}`}>{mod.title}</p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-sm text-center">
              No chapters available for this course.
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="max-w-3xl mx-auto px-12 py-16">
          {hasChapters && activeChapter ? (
            <>
              <span className="text-sm font-bold tracking-wider uppercase text-indigo-600 mb-4 block">
                Module {activeModuleIndex + 1}
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-8">
                {activeChapter.content.chapter}
              </h1>

              <div className="prose prose-slate prose-lg max-w-none">
                <p className="text-slate-600 leading-relaxed mb-6">
                  {activeChapter.content.content}
                </p>
              </div>
            </>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-slate-900 mb-3">No chapters yet</h1>
              <p className="text-slate-600">
                This course does not contain any chapters yet. Please check back later or choose another course.
              </p>
            </div>
          )}

          {hasChapters && (
            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleCompleteModule}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center shadow-lg shadow-indigo-600/20"
              >
                Complete & Continue
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
