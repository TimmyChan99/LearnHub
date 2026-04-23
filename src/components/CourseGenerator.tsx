import React, { useState } from 'react';
import { Course } from '../types';
import { Sparkles, Loader2, Bot, Layers, Target, Clock as ClockIcon } from 'lucide-react';

interface CourseGeneratorProps {
  onCourseGenerated: (course: Course) => void;
}

export default function CourseGenerator({ onCourseGenerated }: CourseGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [focus, setFocus] = useState('Theoretical');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const newCourse: Course = {
        id: `gen-${Date.now()}`,
        title: `Mastering ${topic}`,
        description: `An extensively tailored AI curriculum focusing on ${topic}. Created specifically for a ${level} level.`,
        duration: '4 Weeks',
        level: level,
        modules: [
          `Introduction to ${topic}`,
          `Core Concepts & Theory`,
          `Practical Applications`,
          `Advanced Topics in ${topic}`
        ]
      };
      setIsGenerating(false);
      setTopic('');
      onCourseGenerated(newCourse);
    }, 2500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
          <Sparkles className="text-white w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Generate Curriculum</h1>
        <p className="text-lg text-slate-500">
          Describe what you want to learn, and our AI will architect a custom course syllabus suited to your needs.
        </p>
      </div>

      <div className="bg-indigo-600 rounded-3xl shadow-xl p-8 relative overflow-hidden text-white">
        {/* Decorative circles from sleek theme */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full opacity-50 pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-24 h-24 bg-indigo-400 rounded-full opacity-30 pointer-events-none"></div>

        <form onSubmit={handleGenerate} className="relative z-10 w-full max-w-3xl mx-auto">
          
          <div className="mb-8">
            <label className="block text-sm font-bold uppercase tracking-wider text-indigo-100 mb-4">
              What do you want to learn?
            </label>
            <textarea
              className="w-full px-6 py-6 text-xl rounded-2xl bg-indigo-500 border border-indigo-400 focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white transition-all resize-none font-medium placeholder:text-indigo-200 text-white"
              rows={3}
              placeholder="e.g., Quantum Computing, React state management, Options Trading..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-100 mb-4">
                <Layers className="w-4 h-4" />
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      level === lvl 
                        ? 'bg-white text-indigo-600 shadow-md' 
                        : 'bg-indigo-500 text-indigo-100 hover:bg-indigo-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-100 mb-4">
                <Target className="w-4 h-4" />
                Primary Focus
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Theoretical', 'Practical Project'].map(foc => (
                  <button
                    key={foc}
                    type="button"
                    onClick={() => setFocus(foc)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      focus === foc 
                        ? 'bg-white text-indigo-600 shadow-md' 
                        : 'bg-indigo-500 text-indigo-100 hover:bg-indigo-400'
                    }`}
                  >
                    {foc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-indigo-500/50 flex items-center justify-between">
            <div className="flex items-center text-sm font-medium text-indigo-200">
              <Bot className="w-5 h-5 mr-2 text-indigo-300" />
              Powered by Kognate Engine v4
            </div>
            
            <button
              type="submit"
              disabled={!topic || isGenerating}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-indigo-900/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Architecting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3" />
                  Generate Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
