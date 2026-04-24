import React from 'react';
import { BookOpen, LayoutDashboard, Sparkles, LogOut, User as UserIcon, Settings, Compass } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function Layout({ user, currentPage, onNavigate, onLogout, children }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Catalog', icon: Compass },
    { id: 'generator', label: 'Generate Course', icon: Sparkles },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">LearnHub</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (currentPage === 'viewer' && item.id === 'catalog');
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200">
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-2">
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-5 h-5 text-slate-500" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
