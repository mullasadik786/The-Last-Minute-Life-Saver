import React, { useState, useEffect } from 'react';
import { Task, StreakStats, TaskType, TaskStatus, TaskPriority, MicroTaskItem } from '../types';
import { 
  Plus, 
  Phone, 
  Trash2, 
  Edit2, 
  Check, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  ShieldAlert, 
  Filter, 
  Search,
  CheckCircle,
  AlertTriangle,
  Flame,
  FileText,
  Calendar,
  Wallet,
  Users,
  Presentation,
  HelpCircle,
  X,
  Loader2,
  Store,
  Shield,
  Heart,
  Languages,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import TaskForm from './TaskForm';
import EmergencyPlan from './EmergencyPlan';
import RedPhoneChat from './RedPhoneChat';
import { Language, translations } from '../translations';
import rescueBanner from '../assets/images/productivity_rescue_banner_1782390816046.jpg';

// Import situation solving illustrations
import solveAssignmentImg from '../assets/images/solve_assignment_1782391646884.jpg';
import solveExamImg from '../assets/images/solve_exam_1782391660982.jpg';
import solveMeetingImg from '../assets/images/solve_meeting_1782391676244.jpg';
import solveBillImg from '../assets/images/solve_bill_1782391693003.jpg';
import solvePresentationImg from '../assets/images/solve_presentation_1782391712475.jpg';
import solveGeneralImg from '../assets/images/solve_general_1782391728902.jpg';

const getSituationImage = (type: string) => {
  switch (type) {
    case 'assignment': return solveAssignmentImg;
    case 'exam': return solveExamImg;
    case 'meeting': return solveMeetingImg;
    case 'bill': return solveBillImg;
    case 'presentation': return solvePresentationImg;
    default: return solveGeneralImg;
  }
};

interface DashboardProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  stats: StreakStats;
  onUpdateStats: (stats: StreakStats) => void;
  theme: 'light' | 'dark' | 'tricolor_light' | 'tricolor_dark';
  onChangeTheme: (theme: 'light' | 'dark' | 'tricolor_light' | 'tricolor_dark') => void;
  language: Language;
  onChangeLanguage: (language: Language) => void;
}

export default function Dashboard({ 
  tasks, 
  onUpdateTasks, 
  stats, 
  onUpdateStats,
  theme,
  onChangeTheme,
  language,
  onChangeLanguage
}: DashboardProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active'); // 'active', 'completed', 'missed', 'all'
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals / Panels
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activePlanTask, setActivePlanTask] = useState<Task | null>(null);
  const [isHotlineOpen, setIsHotlineOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  
  // Loading state for AI generation
  const [generatingTaskId, setGeneratingTaskId] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Live timer tick for real-time count-down and panic index calculation
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // refresh every 10 seconds for countdowns
    return () => clearInterval(timer);
  }, []);

  // Calculate task Panic Index and update status if overdue
  const computeTaskMetrics = (task: Task): { panicIndex: number; timeLeftStr: string; isOverdue: boolean } => {
    const now = currentTime;
    const deadlineDate = new Date(task.deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return { panicIndex: 100, timeLeftStr: 'Overdue', isOverdue: true };
    }

    const diffHrs = diffMs / (1000 * 60 * 60);
    const days = Math.floor(diffHrs / 24);
    const hours = Math.floor(diffHrs % 24);
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let timeLeftStr = '';
    if (days > 0) timeLeftStr += `${days}d `;
    if (hours > 0 || days > 0) timeLeftStr += `${hours}h `;
    timeLeftStr += `${minutes}m`;

    // Panic Index calculation: (estimated work hours / remaining time hours) * 100
    const ratio = task.timeAllocated / diffHrs;
    const panicIndex = Math.min(100, Math.max(0, Math.round(ratio * 100)));

    return { panicIndex, timeLeftStr, isOverdue: false };
  };

  // Sync statuses & overdue states and check for streak insurance protection!
  useEffect(() => {
    let changed = false;
    const updatedTasks = tasks.map(t => {
      if (t.status === 'completed' || t.status === 'missed') return t;
      const { isOverdue } = computeTaskMetrics(t);
      if (isOverdue) {
        changed = true;
        return { ...t, status: 'missed' as TaskStatus };
      }
      return t;
    });

    if (changed) {
      onUpdateTasks(updatedTasks);
      
      // Re-calculate streak and stats
      const missedCount = updatedTasks.filter(t => t.status === 'missed').length;
      
      let nextStreak = stats.currentStreak;
      let nextInsurance = stats.streakInsuranceActive;
      let insuranceUsed = false;

      if (stats.streakInsuranceActive) {
        insuranceUsed = true;
        nextInsurance = false; // consume insurance
      } else {
        nextStreak = 0; // streak broken
      }

      onUpdateStats({
        ...stats,
        currentStreak: nextStreak,
        streakInsuranceActive: nextInsurance,
        missedCount,
        totalTasks: updatedTasks.length
      });

      if (insuranceUsed) {
        alert("🛡️ CRISIS INSURED: Your active Streak Insurance was triggered to protect your " + nextStreak + "-save streak from a missed deadline!");
      }
    }
  }, [currentTime]);

  const handleAddTask = (taskData: any) => {
    const newTask: Task = {
      id: Math.random().toString(),
      title: taskData.title,
      details: taskData.details,
      deadline: taskData.deadline,
      type: taskData.type,
      priority: taskData.priority,
      status: 'pending',
      timeAllocated: taskData.timeAllocated,
      panicIndex: 0,
      emergencyPlan: null,
      createdAt: new Date().toISOString()
    };

    const newTasks = [newTask, ...tasks];
    onUpdateTasks(newTasks);
    onUpdateStats({
      ...stats,
      totalTasks: newTasks.length
    });
    setIsFormOpen(false);
  };

  const handleEditTask = (taskData: any) => {
    const updated = tasks.map(t => {
      if (t.id === taskData.id) {
        return {
          ...t,
          title: taskData.title,
          details: taskData.details,
          deadline: taskData.deadline,
          type: taskData.type,
          priority: taskData.priority,
          timeAllocated: taskData.timeAllocated,
          status: t.status === 'missed' && new Date(taskData.deadline).getTime() > new Date().getTime() ? 'pending' : t.status
        };
      }
      return t;
    });
    onUpdateTasks(updated);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm("Are you sure you want to dismiss this commitment?")) {
      const filtered = tasks.filter(t => t.id !== id);
      onUpdateTasks(filtered);
      onUpdateStats({
        ...stats,
        totalTasks: filtered.length,
        missedCount: filtered.filter(t => t.status === 'missed').length,
        totalSaved: filtered.filter(t => t.status === 'completed').length,
      });
      if (activePlanTask?.id === id) {
        setActivePlanTask(null);
      }
    }
  };

  const handleToggleComplete = (task: Task) => {
    const isNowCompleted = task.status !== 'completed';
    const nextStatus: TaskStatus = isNowCompleted ? 'completed' : 'pending';
    
    const updated = tasks.map(t => {
      if (t.id === task.id) {
        return { ...t, status: nextStatus };
      }
      return t;
    });

    onUpdateTasks(updated);

    const completedTasks = updated.filter(t => t.status === 'completed');
    const missedTasks = updated.filter(t => t.status === 'missed');
    
    let nextStreak = stats.currentStreak;
    let pointsBonus = 0;
    
    if (isNowCompleted) {
      nextStreak += 1;
      pointsBonus = 15; // Give +15 Crisis Points per save!
    } else {
      nextStreak = Math.max(0, nextStreak - 1);
    }

    onUpdateStats({
      ...stats,
      currentStreak: nextStreak,
      totalSaved: completedTasks.length,
      missedCount: missedTasks.length,
      crisisPoints: (stats.crisisPoints ?? 0) + pointsBonus
    });
  };

  // Call API to generate emergency tactical plan
  const handleTriggerRescue = async (task: Task) => {
    setGeneratingTaskId(task.id);
    setAiError(null);
    try {
      const metrics = computeTaskMetrics(task);
      const res = await fetch('/api/save-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          details: task.details,
          deadlineTime: metrics.timeLeftStr,
          urgencyLevel: metrics.panicIndex >= 75 ? 'Critical (Panic Index ' + metrics.panicIndex + '%)' : 'High Urgency',
          type: task.type
        })
      });

      const data = await res.json();
      if (res.ok) {
        const microTasksMapped: MicroTaskItem[] = data.microTasks.map((t: string, idx: number) => ({
          id: `mt-${idx}-${Math.random()}`,
          task: t,
          completed: false
        }));

        const updatedPlanTask: Task = {
          ...task,
          status: 'in_progress',
          emergencyPlan: {
            empathyStatement: data.empathyStatement,
            hourlyPlan: data.hourlyPlan,
            microTasks: microTasksMapped,
            focusHacks: data.focusHacks,
            customDrafts: {}
          }
        };

        const updatedTasksList = tasks.map(t => t.id === task.id ? updatedPlanTask : t);
        onUpdateTasks(updatedTasksList);
        setActivePlanTask(updatedPlanTask);
      } else {
        setAiError(data.error || 'The tactical rescue transmission failed. Try again.');
      }
    } catch (e) {
      console.error(e);
      setAiError('Failed to establish contact with the emergency AI server.');
    } finally {
      setGeneratingTaskId(null);
    }
  };

  // CRISIS POINTS SHOP LOGIC
  const buyStreakInsurance = () => {
    const currentPoints = stats.crisisPoints ?? 0;
    if (currentPoints < 20) {
      alert("⚠️ INSUFFICIENT CP: You need at least 20 Crisis Points to buy Streak Insurance. Complete more deadlines!");
      return;
    }
    if (stats.streakInsuranceActive) {
      alert("🛡️ ALREADY ACTIVE: You already have active Streak Insurance protection.");
      return;
    }

    onUpdateStats({
      ...stats,
      crisisPoints: currentPoints - 20,
      streakInsuranceActive: true
    });
    alert("🛡️ SUCCESS: Streak Insurance has been activated! Your next deadline miss will be forgiven without breaking your save streak.");
  };

  const buyBackMissedDeadline = () => {
    const currentPoints = stats.crisisPoints ?? 0;
    if (currentPoints < 35) {
      alert("⚠️ INSUFFICIENT CP: You need at least 35 Crisis Points to buy back a failed deadline. Keep working!");
      return;
    }

    const missedTasks = tasks.filter(t => t.status === 'missed');
    if (missedTasks.length === 0) {
      alert("✨ ALL CLEAR: You have no missed deadlines to buy back. Outstanding job!");
      return;
    }

    const target = missedTasks[0];
    const updated = tasks.map(t => {
      if (t.id === target.id) {
        return {
          ...t,
          status: 'pending' as TaskStatus,
          // extend deadline by 24 hours
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
      }
      return t;
    });

    onUpdateTasks(updated);
    onUpdateStats({
      ...stats,
      crisisPoints: currentPoints - 35,
      currentStreak: stats.currentStreak + 1,
      missedCount: Math.max(0, stats.missedCount - 1)
    });

    alert(`❤️ CRISIS SAVE: "${target.title}" was restored back to active state and granted a 24-hour extension. Your streak has been safely restored!`);
  };

  const buyChecklistBooster = () => {
    const currentPoints = stats.crisisPoints ?? 0;
    if (currentPoints < 15) {
      alert("⚠️ INSUFFICIENT CP: You need at least 15 Crisis Points to unlock the Checklist Booster.");
      return;
    }

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    if (pendingTasks.length === 0) {
      alert("You need at least one pending task to apply the booster!");
      return;
    }

    const target = pendingTasks[0];
    const boostedPlan: MicroTaskItem[] = [
      { id: 'boost-1', task: '⚡ Clear physical workspace and place glass of water', completed: false },
      { id: 'boost-2', task: '⚡ Write down the document title and your name', completed: false },
      { id: 'boost-3', task: '⚡ Write 3 messy sentences of pure stream-of-consciousness ideas', completed: false },
      { id: 'boost-4', task: '⚡ Convert those sentences using the Freeze-Mode prose helper', completed: false },
      { id: 'boost-5', task: '⚡ Take a deep breath: 20% finished is infinitely better than 0%', completed: false },
    ];

    const updated = tasks.map(t => {
      if (t.id === target.id) {
        return {
          ...t,
          status: 'in_progress' as TaskStatus,
          emergencyPlan: {
            empathyStatement: "BOOSTER ACTIVE: No thinking required. Just click and complete.",
            hourlyPlan: [
              { timeSlot: "First 10 mins", focusTask: "Unclutter setup", actionableDeliverable: "Pristine physical desk" },
              { timeSlot: "Next 15 mins", focusTask: "Freeze Mode drafting", actionableDeliverable: "3 raw sentences polished" }
            ],
            microTasks: boostedPlan,
            focusHacks: ["The 2-Minute Rule", "Cognitive pacing via soundscape focus tones"],
            customDrafts: {}
          }
        };
      }
      return t;
    });

    onUpdateTasks(updated);
    onUpdateStats({
      ...stats,
      crisisPoints: currentPoints - 15
    });

    alert(`🧠 BOOSTER UNLOCKED: Applied a 5-step single-focus blueprint to "${target.title}". View its rescue action blueprint right now!`);
  };

  // Category styling lookup
  const getCategoryIcon = (type: TaskType) => {
    switch (type) {
      case 'assignment': return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'exam': return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'bill': return <Wallet className="w-4 h-4 text-emerald-500" />;
      case 'meeting': return <Users className="w-4 h-4 text-purple-500" />;
      case 'presentation': return <Presentation className="w-4 h-4 text-rose-500" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  // Filter and Search logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || task.type === filterType;
    
    let matchesStatus = true;
    if (filterStatus === 'active') {
      matchesStatus = task.status === 'pending' || task.status === 'in_progress';
    } else if (filterStatus === 'completed') {
      matchesStatus = task.status === 'completed';
    } else if (filterStatus === 'missed') {
      matchesStatus = task.status === 'missed';
    }

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate dynamic average panic level of active tasks
  const activeTasksList = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const averagePanic = activeTasksList.length > 0
    ? Math.round(activeTasksList.reduce((acc, t) => acc + computeTaskMetrics(t).panicIndex, 0) / activeTasksList.length)
    : 0;

  // ----------------------------------------------------
  // THEME MORPHING DEFINITIONS (Urgency-Based UI Morphing)
  // ----------------------------------------------------
  const isCriticalPanic = averagePanic >= 75;
  const isMediumPanic = averagePanic >= 40 && averagePanic < 75;

  let bgClass = "";
  let headerClass = "";
  let headerTextClass = "";
  let cardClass = "";
  let logoBgClass = "";
  let filterBarClass = "";
  let statsCardClass = "";
  let statsTitleClass = "";
  let statsValueClass = "";

  if (theme === 'dark') {
    bgClass = "bg-slate-950 text-slate-100 min-h-screen pb-16 relative transition-all duration-500";
    headerClass = "bg-slate-900 border-b border-slate-800 py-4 px-4 md:px-8 text-white transition-all duration-500";
    headerTextClass = `text-lg font-black tracking-tight font-sans ${isCriticalPanic ? 'text-rose-500 animate-pulse' : isMediumPanic ? 'text-amber-500' : 'text-indigo-400'}`;
    cardClass = "bg-slate-900 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:shadow-lg flex flex-col justify-between h-fit transition-all duration-500 text-white overflow-hidden";
    logoBgClass = `p-2 rounded-xl border flex items-center justify-center ${isCriticalPanic ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-indigo-400'}`;
    filterBarClass = "bg-slate-900 rounded-2xl border border-slate-800 p-4 mb-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all text-white";
    statsCardClass = "bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-5 shadow-sm flex items-center justify-between";
    statsTitleClass = "text-[10px] font-bold text-slate-400 uppercase tracking-wider block";
    statsValueClass = "text-2xl font-black text-white mt-1 block font-mono";
  } else if (theme === 'tricolor_light') {
    bgClass = "bg-[#FCF9F2] text-[#1B2A1E] min-h-screen pb-16 relative transition-all duration-500";
    headerClass = "bg-white border-b-2 border-orange-200/50 py-4 px-4 md:px-8 text-[#1B2A1E] transition-all duration-500";
    headerTextClass = `text-lg font-black tracking-tight font-sans ${isCriticalPanic ? 'text-rose-600 animate-pulse' : 'text-orange-600'}`;
    cardClass = "bg-white rounded-2xl border-2 border-emerald-100/30 hover:border-orange-400 hover:shadow-lg flex flex-col justify-between h-fit transition-all duration-500 text-[#1B2A1E] overflow-hidden";
    logoBgClass = "p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-500/20 flex items-center justify-center";
    filterBarClass = "bg-white rounded-2xl border-2 border-emerald-100/20 p-4 mb-6 shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all text-[#1B2A1E]";
    statsCardClass = "bg-white text-[#1B2A1E] rounded-2xl border-2 border-orange-200/50 p-5 shadow-3xs flex items-center justify-between";
    statsTitleClass = "text-[10px] font-bold text-orange-600 uppercase tracking-wider block";
    statsValueClass = "text-2xl font-black text-[#1B2A1E] mt-1 block font-mono";
  } else if (theme === 'tricolor_dark') {
    bgClass = "bg-[#0B1510] text-[#E8F0EA] min-h-screen pb-16 relative transition-all duration-500";
    headerClass = "bg-[#0E1E16] border-b-2 border-[#138808]/40 py-4 px-4 md:px-8 text-white transition-all duration-500";
    headerTextClass = `text-lg font-black tracking-tight font-sans ${isCriticalPanic ? 'text-rose-400 animate-pulse' : 'text-orange-400'}`;
    cardClass = "bg-[#12241A] rounded-2xl border border-[#138808]/30 hover:border-orange-500 hover:shadow-lg flex flex-col justify-between h-fit transition-all duration-500 text-[#E8F0EA] overflow-hidden";
    logoBgClass = "p-2 bg-[#12241A] text-emerald-400 rounded-xl border border-[#138808]/30 flex items-center justify-center";
    filterBarClass = "bg-[#12241A] rounded-2xl border border-[#138808]/30 p-4 mb-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all text-white";
    statsCardClass = "bg-[#12241A] text-[#E8F0EA] rounded-2xl border border-[#138808]/40 p-5 shadow-sm flex items-center justify-between";
    statsTitleClass = "text-[10px] font-bold text-emerald-400 uppercase tracking-wider block";
    statsValueClass = "text-2xl font-black text-white mt-1 block font-mono";
  } else {
    // Default light theme with full classic panic morphing
    bgClass = "bg-slate-50 text-slate-800 min-h-screen pb-16 relative transition-all duration-500";
    headerClass = "bg-white border-b border-slate-100 py-4 px-4 md:px-8 text-slate-800 transition-all duration-500";
    headerTextClass = "text-lg font-black text-slate-900 tracking-tight font-sans";
    cardClass = "bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between h-fit transition-all duration-500 overflow-hidden";
    logoBgClass = "p-2 bg-emerald-500/10 text-emerald-600 rounded-xl shadow-xs border border-emerald-200/40 flex items-center justify-center animate-pulse";
    filterBarClass = "bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all";
    statsCardClass = "bg-white text-slate-800 rounded-2xl border border-slate-100 p-5 shadow-3xs flex items-center justify-between";
    statsTitleClass = "text-[10px] font-bold text-slate-400 uppercase tracking-wider block";
    statsValueClass = "text-2xl font-black text-slate-800 mt-1 block font-mono";

    if (isCriticalPanic) {
      bgClass = "bg-slate-950 text-slate-100 min-h-screen pb-16 relative transition-all duration-500";
      headerClass = "bg-[#0c0e17] border-b border-rose-950/40 py-4 px-4 md:px-8 text-white transition-all duration-500";
      headerTextClass = "text-lg font-extrabold text-rose-500 tracking-tight font-sans animate-pulse";
      cardClass = "bg-[#111422] rounded-2xl border border-rose-950/40 hover:border-rose-500/60 ring-1 ring-rose-500/5 shadow-lg flex flex-col justify-between h-fit transition-all duration-500 overflow-hidden";
      logoBgClass = "p-2 bg-rose-600 text-white rounded-xl shadow-md border border-rose-500 flex items-center justify-center animate-ping";
      filterBarClass = "bg-[#111422] rounded-2xl border border-rose-950/30 p-4 mb-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all text-white";
      statsCardClass = "bg-[#111422] text-white rounded-2xl border border-rose-950/40 p-5 shadow-md flex items-center justify-between";
      statsTitleClass = "text-[10px] font-bold text-rose-400 uppercase tracking-wider block";
      statsValueClass = "text-2xl font-black text-white mt-1 block font-mono";
    } else if (isMediumPanic) {
      bgClass = "bg-[#faf8f4] text-slate-800 min-h-screen pb-16 relative transition-all duration-500";
      headerClass = "bg-white border-b border-amber-200/50 py-4 px-4 md:px-8 text-slate-800 transition-all duration-500";
      headerTextClass = "text-lg font-black text-amber-900 tracking-tight font-sans";
      cardClass = "bg-white rounded-2xl border border-amber-100/60 shadow-xs hover:border-amber-400 flex flex-col justify-between h-fit transition-all duration-500 overflow-hidden";
      logoBgClass = "p-2 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-200 flex items-center justify-center animate-pulse";
      filterBarClass = "bg-white rounded-2xl border border-amber-100 p-4 mb-6 shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all";
      statsCardClass = "bg-white text-slate-800 rounded-2xl border border-amber-200/60 p-5 shadow-xs hover:border-amber-400 flex items-center justify-between";
      statsTitleClass = "text-[10px] font-bold text-amber-600 uppercase tracking-wider block";
      statsValueClass = "text-2xl font-black text-slate-800 mt-1 block font-mono";
    }
  }

  const t = translations[language];

  // Render dedicated plan view if one is actively open
  if (activePlanTask) {
    const currentFullTaskState = tasks.find(t => t.id === activePlanTask.id) || activePlanTask;
    return (
      <EmergencyPlan 
        task={currentFullTaskState} 
        onUpdateTask={(updatedTask) => {
          const newList = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
          onUpdateTasks(newList);
          setActivePlanTask(updatedTask);
        }}
        onBack={() => setActivePlanTask(null)}
      />
    );
  }

  return (
    <div className={bgClass}>
      {/* Top Bar for Language & Theme Selector */}
      <div className="bg-slate-900 text-white py-1.5 px-4 text-xs border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="font-bold text-orange-500">🇮🇳</span>
            <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-300">Indian Tri-Color Special Edition</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Selection */}
            <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg px-2 py-0.5 border border-slate-700">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => onChangeLanguage(e.target.value as any)}
                className="bg-transparent border-none text-[11px] font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-slate-900 text-white font-bold">English</option>
                <option value="te" className="bg-slate-900 text-white font-bold">తెలుగు (Telugu)</option>
                <option value="hi" className="bg-slate-900 text-white font-bold">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* Theme Selection Toggle */}
            <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => onChangeTheme('light')}
                className={`p-1 rounded-md text-[10px] font-bold transition-all ${theme === 'light' ? 'bg-indigo-600 text-white animate-in zoom-in-90' : 'text-slate-400 hover:text-slate-200'}`}
                title="Light Mode"
              >
                <Sun className="w-3 h-3" />
              </button>
              <button
                onClick={() => onChangeTheme('dark')}
                className={`p-1 rounded-md text-[10px] font-bold transition-all ${theme === 'dark' ? 'bg-indigo-600 text-white animate-in zoom-in-90' : 'text-slate-400 hover:text-slate-200'}`}
                title="Dark Mode"
              >
                <Moon className="w-3 h-3" />
              </button>
              <button
                onClick={() => onChangeTheme('tricolor_light')}
                className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold tracking-wider transition-all uppercase ${theme === 'tricolor_light' ? 'bg-gradient-to-r from-orange-500 to-emerald-600 text-white' : 'text-orange-400 hover:text-orange-300'}`}
                title="Tri-Color Light Mode"
              >
                🇮🇳 Light
              </button>
              <button
                onClick={() => onChangeTheme('tricolor_dark')}
                className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold tracking-wider transition-all uppercase ${theme === 'tricolor_dark' ? 'bg-gradient-to-r from-orange-500 to-emerald-600 text-white shadow-xs' : 'text-emerald-400 hover:text-emerald-300'}`}
                title="Tri-Color Dark Mode"
              >
                🇮🇳 Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upper Navigation Indicator / Logo area */}
      <header className={headerClass}>
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className={logoBgClass}>
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h1 className={headerTextClass}>
                {t.appName}
              </h1>
              <p className="text-xs text-slate-400 font-medium">{t.appSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsShopOpen(!isShopOpen)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold border border-amber-400 transition-colors shadow-sm cursor-pointer"
            >
              <Store className="w-4 h-4" />
              {t.depotShop} ({stats.crisisPoints ?? 0} CP)
            </button>

            <button
              onClick={() => setIsHotlineOpen(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-bold border border-rose-100 transition-colors shadow-3xs cursor-pointer"
            >
              <Phone className="w-4 h-4 animate-bounce text-rose-600" />
              {t.emergencyHotline}
            </button>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {t.registerDeadline}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-8 md:px-8">
        {/* Quick error prompt if AI fails */}
        {aiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span>{aiError}</span>
            </div>
            <button 
              onClick={() => setAiError(null)}
              className="p-1 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tri-Color Hero Banner with Custom Productivity Illustration */}
        <div className="mb-8 rounded-3xl overflow-hidden relative border border-orange-500/10 shadow-md bg-gradient-to-r from-orange-500/10 via-white/5 to-emerald-500/10 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6 transition-all duration-300">
          <div className="space-y-3 max-w-xl z-10 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-orange-500/10 text-orange-600 border border-orange-500/20">
              🇮🇳 {language === 'te' ? 'భారతీయ త్రివర్ణ ఎడిషన్' : language === 'hi' ? 'भारतीय तिरंगा संस्करण' : 'Indian Tri-Color Special Edition'}
            </span>
            <h2 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
              {t.appName}
            </h2>
            <p className="text-xs md:text-sm leading-relaxed font-medium opacity-80">
              {t.appSubtitle} — {language === 'te' ? 'ఖచ్చితమైన ఏకాగ్రత, వేగం మరియు సంక్షోభ నిర్వహణ ఆత్మతో రూపొందించబడింది.' : language === 'hi' ? 'सटीक ध्यान, गति और संकट प्रबंधन की भावना के साथ बनाया गया है।' : 'engineered specifically with the spirit of absolute focus, high momentum, and ultimate crisis rescue.'}
            </p>
          </div>
          <div className="w-full md:w-80 h-40 md:h-44 rounded-2xl overflow-hidden shadow-md border border-white/20 flex-shrink-0 relative">
            <img 
              src={rescueBanner} 
              alt="Indian Tri-color Rescue Banner" 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Dynamic Metric Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Streak Card */}
          <div className={`${statsCardClass} transition-all duration-300`}>
            <div>
              <span className={statsTitleClass}>{t.crisisSaveStreak}</span>
              <span className={`${statsValueClass} flex items-center gap-1`}>
                {stats.currentStreak}
                <Flame className="w-5 h-5 text-amber-500 fill-amber-100 animate-pulse" />
              </span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">{t.consecutiveSaves}</span>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          {/* Saved Tasks */}
          <div className={`${statsCardClass} transition-all duration-300`}>
            <div>
              <span className={statsTitleClass}>{t.totalDeadlinesSaved}</span>
              <span className={statsValueClass}>{stats.totalSaved}</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">{t.earnPointsPerSave}</span>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Missed / Overdue */}
          <div className={`${statsCardClass} transition-all duration-300`}>
            <div>
              <span className={statsTitleClass}>{t.failedOverdue}</span>
              <span className={statsValueClass}>{stats.missedCount}</span>
              <span className="text-[10px] text-rose-500 font-bold mt-1 block">{t.missedTargets}</span>
            </div>
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          {/* Threat Meter */}
          <div className="bg-slate-900 rounded-2xl p-5 shadow-md flex items-center justify-between text-white border border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.systemPanicIndex}</span>
              <span className="text-2xl font-black text-white mt-1 block font-mono">
                {averagePanic}%
              </span>
              <span className={`text-[10px] font-bold mt-1 block uppercase ${
                averagePanic >= 75 ? 'text-rose-400 animate-pulse' : averagePanic >= 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {averagePanic >= 75 ? t.highDisasterDanger : averagePanic >= 40 ? t.workloadOverflow : t.underControl}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              averagePanic >= 75 ? 'bg-rose-500/10 text-rose-400' : 'bg-white/10 text-slate-300'
            }`}>
              <TrendingUp className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </section>

        {/* EXPANDABLE REWARDS DEPOT & STREAK INSURANCE SHOP */}
        {isShopOpen && (
          <section className="bg-gradient-to-r from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 mb-6 shadow-lg text-white space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 animate-in slide-in-from-left">
                <Store className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">
                  {t.rewardsDepotTitle}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">{t.balanceLabel}</span>
                <span className="font-mono font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-md animate-pulse">
                  {stats.crisisPoints ?? 0} CP
                </span>
                {stats.streakInsuranceActive && (
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] rounded-sm font-extrabold uppercase tracking-wide">
                    🛡️ {t.streakInsuranceActive}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product 1 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      {t.streakInsuranceTitle}
                    </h3>
                    <span className="font-mono text-xs font-black text-amber-400">20 CP</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    {t.streakInsuranceDesc}
                  </p>
                </div>
                <button
                  onClick={buyStreakInsurance}
                  disabled={stats.streakInsuranceActive}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    stats.streakInsuranceActive 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {stats.streakInsuranceActive ? t.streakInsuranceActive : t.streakInsuranceBtn}
                </button>
              </div>

              {/* Product 2 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-400" />
                      {t.missedTaskBuyBackTitle}
                    </h3>
                    <span className="font-mono text-xs font-black text-amber-400">35 CP</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    {t.missedTaskBuyBackDesc}
                  </p>
                </div>
                <button
                  onClick={buyBackMissedDeadline}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  {t.missedTaskBuyBackBtn}
                </button>
              </div>

              {/* Product 3 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      {t.checklistBoosterTitle}
                    </h3>
                    <span className="font-mono text-xs font-black text-amber-400">15 CP</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    {t.checklistBoosterDesc}
                  </p>
                </div>
                <button
                  onClick={buyChecklistBooster}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  {t.checklistBoosterBtn}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Filters and Search Bar */}
        <section className={filterBarClass}>
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex bg-slate-100/10 border border-slate-700/10 rounded-lg p-0.5 text-xs font-semibold text-slate-800">
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  filterStatus === 'active' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.pendingTab}
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  filterStatus === 'completed' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.savedTab}
              </button>
              <button
                onClick={() => setFilterStatus('missed')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  filterStatus === 'missed' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.missedTab}
              </button>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  filterStatus === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.allTab}
              </button>
            </div>

            {/* Category select */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs font-semibold text-slate-800">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent border-none py-1.5 pl-1 pr-4 focus:outline-none text-slate-600 font-medium cursor-pointer"
              >
                <option value="all">{t.allCategories}</option>
                <option value="assignment">{language === 'te' ? 'అసైన్‌మెంట్ / వర్క్' : language === 'hi' ? 'असाइनमेंट / काम' : 'Assignment / Work'}</option>
                <option value="exam">{language === 'te' ? 'పరీక్ష ప్రిపరేషన్' : language === 'hi' ? 'परीक्षा अध्ययन' : 'Exam Study'}</option>
                <option value="meeting">{language === 'te' ? 'సమావేశాలు' : language === 'hi' ? 'बैठकें' : 'Meetings'}</option>
                <option value="bill">{language === 'te' ? 'బిల్లులు' : language === 'hi' ? 'विधेयक' : 'Bills'}</option>
                <option value="presentation">{language === 'te' ? 'ప్రెజెంటేషన్లు' : language === 'hi' ? 'प्रस्तुतियाँ' : 'Presentations'}</option>
                <option value="other">{language === 'te' ? 'ఇతర' : language === 'hi' ? 'अन्य' : 'Other'}</option>
              </select>
            </div>
          </div>

          {/* Search box */}
          <div className="relative w-full md:max-w-xs text-slate-800">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs focus:outline-none placeholder:text-slate-400 bg-slate-50"
            />
          </div>
        </section>

        {/* Task Grid */}
        <section>
          {filteredTasks.length === 0 ? (
            <div className="bg-white text-slate-800 rounded-3xl border border-slate-100 p-12 text-center shadow-3xs max-w-xl mx-auto">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-800 mb-1">{t.noCommitmentsMatch}</h3>
              <p className="text-slate-400 text-xs mb-6">
                {t.registerFirstDeadlineDesc}
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> {t.registerFirstDeadlineBtn}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => {
                const { panicIndex, timeLeftStr, isOverdue } = computeTaskMetrics(task);
                const isGeneratingPlan = generatingTaskId === task.id;

                return (
                  <div 
                    key={task.id}
                    className={cardClass}
                  >
                    {/* Urgency Highlight Banner for High Panic */}
                    {!isOverdue && task.status !== 'completed' && panicIndex >= 75 && (
                      <div className="bg-rose-500 text-white px-4 py-1 text-[10px] font-extrabold tracking-wider uppercase text-center flex items-center justify-center gap-1 animate-pulse">
                        <Flame className="w-3.5 h-3.5" /> High Risk Failure Threat! Complete Immediately
                      </div>
                    )}

                    {/* Visual Card Image Banner */}
                    <div className="h-32 w-full overflow-hidden relative bg-slate-100/10 border-b border-slate-100/10 flex-shrink-0">
                      <img 
                        src={getSituationImage(task.type)} 
                        alt={`${task.type} situation`} 
                        className="w-full h-full object-cover opacity-85 hover:opacity-100 hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="p-5 flex-1">
                      {/* Card Category Header */}
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-semibold text-[10px] uppercase flex items-center gap-1.5 capitalize">
                          {getCategoryIcon(task.type)}
                          {task.type}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {/* Complete toggle quick check */}
                          <button
                            onClick={() => handleToggleComplete(task)}
                            className={`p-1 rounded-md border transition-all ${
                              task.status === 'completed'
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-200 text-slate-300 hover:border-emerald-300 hover:text-emerald-500'
                            }`}
                            title={task.status === 'completed' ? "Mark Incomplete" : "Mark Completed"}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3px]" />
                          </button>
                          
                          <button
                            onClick={() => setEditingTask(task)}
                            className="p-1 rounded-md border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
                            title="Edit Deadline"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 rounded-md border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 transition-all"
                            title="Delete Deadline"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Details */}
                      <h3 className={`font-bold text-slate-800 leading-snug text-base ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </h3>
                      {task.details && (
                        <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {task.details}
                        </p>
                      )}

                      {/* Real-Time Countdown Block */}
                      <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between text-slate-800">
                        <span className="text-xs text-slate-400 font-medium">Time Remaining:</span>
                        <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                          task.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : isOverdue || task.status === 'missed'
                            ? 'bg-red-50 text-red-600'
                            : panicIndex >= 75
                            ? 'bg-rose-50 text-rose-600 animate-pulse'
                            : panicIndex >= 40
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          {task.status === 'completed' ? 'Saved' : timeLeftStr}
                        </span>
                      </div>

                      {/* Panic Meter Indicator */}
                      {task.status !== 'completed' && task.status !== 'missed' && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-slate-400 font-bold uppercase tracking-wider">Tactical Panic Index:</span>
                            <span className={`font-mono font-black ${
                              panicIndex >= 75 ? 'text-rose-600' : panicIndex >= 40 ? 'text-amber-600' : 'text-emerald-600'
                            }`}>
                              {panicIndex}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                panicIndex >= 75 ? 'bg-rose-500' : panicIndex >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${panicIndex}%` }}
                            />
                          </div>
                          
                          <span className="text-[9px] text-slate-400 block mt-1">
                            {panicIndex >= 75 
                              ? '🚨 Immediate action required: work exceeds remaining window!' 
                              : panicIndex >= 40 
                              ? '⚠️ Procrastination zone. Build momentum now.' 
                              : '💡 Easy pace. Stick to schedule to finish comfortably.'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Rescue Actions Trigger */}
                    <div className="px-5 py-4 border-t border-slate-50 bg-slate-50/40 rounded-b-2xl">
                      {task.status === 'completed' ? (
                        <div className="text-center py-1.5 text-xs text-emerald-600 font-bold flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-4.5 h-4.5" />
                          On-Time Save Successful!
                        </div>
                      ) : task.status === 'missed' ? (
                        <div className="text-center py-1.5 text-xs text-rose-500 font-bold flex items-center justify-center gap-1.5">
                          <AlertTriangle className="w-4.5 h-4.5" />
                          Deadline Missed
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (task.emergencyPlan) {
                              setActivePlanTask(task);
                            } else {
                              handleTriggerRescue(task);
                            }
                          }}
                          disabled={isGeneratingPlan}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-3xs ${
                            task.emergencyPlan
                              ? 'bg-slate-900 hover:bg-slate-800 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          } disabled:opacity-50`}
                        >
                          {isGeneratingPlan ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Tactical Planning in Progress...</span>
                            </>
                          ) : task.emergencyPlan ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>View Rescue Action Blueprint</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                              <span>AI Save Me (Create Plan)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Task Creation Modal */}
      {isFormOpen && (
        <TaskForm 
          onSave={handleAddTask} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {/* Task Editing Modal */}
      {editingTask && (
        <TaskForm 
          task={editingTask}
          onSave={handleEditTask} 
          onClose={() => setEditingTask(null)} 
        />
      )}

      {/* Direct Procrastination Hotline Drawer */}
      {isHotlineOpen && (
        <RedPhoneChat 
          task={activePlanTask} 
          onClose={() => setIsHotlineOpen(false)} 
        />
      )}
    </div>
  );
}
