import React, { useState, useEffect } from 'react';
import { Task, StreakStats } from './types';
import Dashboard from './components/Dashboard';

// Seed initial tasks so the user can immediately experience the AI companion
const SEED_TASKS: Task[] = [
  {
    id: 'seed-task-1',
    title: 'Chemistry Lab Report (Crystallization)',
    details: 'Needs to include copper sulfate crystallization charts, safety analysis, and structured conclusion. Procrastinated all weekend, completely frozen and dreading the blank page.',
    deadline: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(), // 3.5 hours from now
    type: 'assignment',
    priority: 'high',
    status: 'pending',
    timeAllocated: 2,
    panicIndex: 0,
    emergencyPlan: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-task-2',
    title: 'Technical Lead Mock Interview Prep',
    details: 'Live system design practice with an industry mentor. Need to review load balancers, caching, CDN structures, and prepare self-introduction.',
    deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    type: 'meeting',
    priority: 'critical',
    status: 'pending',
    timeAllocated: 1.5,
    panicIndex: 0,
    emergencyPlan: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-task-3',
    title: 'Monthly Server & Hosting Bill Payment',
    details: 'Pay the hosting renewal invoice to prevent our preview environment servers from cold-stopping.',
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 2 days from now
    type: 'bill',
    priority: 'medium',
    status: 'pending',
    timeAllocated: 0.5,
    panicIndex: 0,
    emergencyPlan: null,
    createdAt: new Date().toISOString()
  }
];

const SEED_STATS: StreakStats = {
  currentStreak: 4,
  totalSaved: 12,
  totalTasks: 3,
  missedCount: 1,
  crisisPoints: 45
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<StreakStats>(SEED_STATS);
  const [theme, setTheme] = useState<'light' | 'dark' | 'tricolor_light' | 'tricolor_dark'>('light');
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage or fall back to seed data
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('lastminute_tasks');
      const savedStats = localStorage.getItem('lastminute_stats');
      const savedTheme = localStorage.getItem('lastminute_theme');
      const savedLang = localStorage.getItem('lastminute_lang');
      
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks(SEED_TASKS);
      }
      
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        setStats(SEED_STATS);
      }

      if (savedTheme) {
        setTheme(savedTheme as any);
      } else {
        setTheme('light');
      }

      if (savedLang) {
        setLanguage(savedLang as any);
      } else {
        setLanguage('en');
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
      setTasks(SEED_TASKS);
      setStats(SEED_STATS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('lastminute_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage:', e);
    }
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('lastminute_stats', JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving stats to localStorage:', e);
    }
  }, [stats, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('lastminute_theme', theme);
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
  }, [theme, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('lastminute_lang', language);
    } catch (e) {
      console.error('Error saving language to localStorage:', e);
    }
  }, [language, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading Crisis Companion...</p>
        </div>
      </div>
    );
  }

  return (
    <Dashboard 
      tasks={tasks}
      onUpdateTasks={setTasks}
      stats={stats}
      onUpdateStats={setStats}
      theme={theme}
      onChangeTheme={setTheme}
      language={language}
      onChangeLanguage={setLanguage}
    />
  );
}
