import React, { useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User, isSignUp?: boolean) => void;
  isLoading?: boolean;
  loginError?: string | null;
}

export default function Auth({ onLogin, isLoading = false, loginError = null }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!isSignUp) {
      onLogin({
        email: email,
        password: password
      });
      return;
    }

    onLogin({
      id: 'usr-1',
      name: name,
      email: email,
      enrolledCourses: ['c1', 'c2'],
      progress: { c1: 45, c2: 12 },
    }, true);
  };

  return (
    <main className="grid md:grid-cols-2 h-screen w-full bg-white">
      {/* Left Pane - Form */}
      <div className="flex flex-col justify-center items-center px-8 md:px-24">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">LearnHub</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-slate-500 mb-8">
            {isSignUp
              ? 'Start your learning journey with AI-generated courses.'
              : 'Enter your credentials to access your dashboard.'}
          </p>

          {/* Error Message */}
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{loginError}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-green-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="Alex Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign up' : 'Sign in')}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type='button'
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
              className="text-indigo-600 font-bold hover:underline disabled:opacity-50"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>

      {/* Right Pane - Visual */}
      <div className="hidden md:flex bg-slate-50 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Master any subject with AI-tailored curriculums.
          </h2>
          <p className="text-xl text-slate-600">
            Generate custom courses, track your progress, and learn at your own pace.
          </p>
          
          <div className="mt-12 bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 transform rotate-2 hover:rotate-0 transition-transform cursor-default">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Sparkles className="text-indigo-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Course Generated</p>
              <p className="text-xs text-slate-500">Advanced Machine Learning ready.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
