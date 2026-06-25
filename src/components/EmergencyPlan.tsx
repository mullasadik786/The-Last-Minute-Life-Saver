import React, { useState, useEffect } from 'react';
import { Task, MicroTaskItem } from '../types';
import { 
  Sparkles, 
  Clock, 
  Lightbulb, 
  CheckCircle, 
  Copy, 
  Mail, 
  BookOpen, 
  PenTool, 
  ChevronRight, 
  CheckSquare, 
  Square,
  ArrowLeft,
  Loader2,
  Volume2,
  Play,
  Pause,
  Compass,
  FileText,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Flame,
  User,
  Activity,
  ArrowRight
} from 'lucide-react';

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

interface EmergencyPlanProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
  onBack: () => void;
}

export default function EmergencyPlan({ task, onUpdateTask, onBack }: EmergencyPlanProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'checklist' | 'hacks' | 'draft' | 'freezemode' | 'dropbox' | 'calendar'>('schedule');
  
  // Tab states: Draft Assistant
  const [draftType, setDraftType] = useState<'outline' | 'email_extension' | 'starter_paragraph' | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Tab states: Freeze Mode (Co-Drafting & Sounds)
  const [messyInput, setMessyInput] = useState('');
  const [polishedProse, setPolishedProse] = useState('');
  const [isElevatingProse, setIsElevatingProse] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.15);
  const [soundType, setSoundType] = useState<'binaural' | 'whitenoise'>('binaural');
  const [audioNodes, setAudioNodes] = useState<{ ctx: AudioContext; osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);

  // Tab states: Drop Box (Note Organizer)
  const [chaosInput, setChaosInput] = useState(task.chaosNotes || '');
  const [isCleaningNotes, setIsCleaningNotes] = useState(false);

  // Tab states: Calendar Hijacker
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, time: '1:00 PM - 2:00 PM', title: 'Doomscroll Instagram & Reddit', priority: 'Low / Distraction', hijacked: false },
    { id: 2, time: '2:15 PM - 3:30 PM', title: 'Watch YouTube Productive Procrastination videos', priority: 'Low / Distraction', hijacked: false },
    { id: 3, time: '4:00 PM - 5:00 PM', title: 'Browse gaming blogs', priority: 'Low / Distraction', hijacked: false },
  ]);
  const [isHijacking, setIsHijacking] = useState(false);

  const plan = task.emergencyPlan;

  // Cleanup synthesizer on component unmount
  useEffect(() => {
    return () => {
      if (audioNodes) {
        try {
          audioNodes.osc1.stop();
          audioNodes.osc2.stop();
          audioNodes.ctx.close();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, [audioNodes]);

  if (!plan) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center max-w-lg mx-auto">
        <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">No Active Rescue Plan</h3>
        <p className="text-slate-500 text-sm mb-6">
          Generate an AI-powered tactical schedule and outline to unblock this task.
        </p>
      </div>
    );
  }

  // Handle microtask checklist toggling
  const handleToggleMicroTask = (id: string) => {
    const updatedMicroTasks = plan.microTasks.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    
    const anyChecked = updatedMicroTasks.some(t => t.completed);
    const allChecked = updatedMicroTasks.every(t => t.completed);
    
    let nextStatus = task.status;
    if (allChecked) {
      nextStatus = 'completed';
    } else if (anyChecked) {
      nextStatus = 'in_progress';
    }

    onUpdateTask({
      ...task,
      status: nextStatus,
      emergencyPlan: {
        ...plan,
        microTasks: updatedMicroTasks
      }
    });
  };

  // Trigger Draft Assistant API
  const handleGenerateDraft = async (type: 'outline' | 'email_extension' | 'starter_paragraph') => {
    setDraftType(type);
    setIsGeneratingDraft(true);
    setDraftContent('');
    try {
      const res = await fetch('/api/draft-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          details: task.details,
          type: task.type,
          draftType: type
        })
      });
      const data = await res.json();
      if (res.ok) {
        setDraftContent(data.draft);
        const updatedDrafts = { ...(plan.customDrafts || {}), [type]: data.draft };
        onUpdateTask({
          ...task,
          emergencyPlan: {
            ...plan,
            customDrafts: updatedDrafts
          }
        });
      } else {
        setDraftContent('Error generating starter text. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setDraftContent('Failed to connect to the draft server.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleCopyDraft = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Co-Draft API handler (Freeze Mode)
  const handleElevateProse = async () => {
    if (!messyInput.trim()) return;
    setIsElevatingProse(true);
    setPolishedProse('');
    try {
      const res = await fetch('/api/co-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messyText: messyInput,
          taskContext: { title: task.title, details: task.details }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPolishedProse(data.polishedText);
      } else {
        setPolishedProse('The server was overwhelmed. Try rewriting slightly simpler.');
      }
    } catch (e) {
      setPolishedProse('Connection failed. Please check your system status.');
    } finally {
      setIsElevatingProse(false);
    }
  };

  // De-clutter note API handler (Drop box)
  const handleCleanNotes = async () => {
    if (!chaosInput.trim()) return;
    setIsCleaningNotes(true);
    try {
      const res = await fetch('/api/de-clutter-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawNotes: chaosInput,
          taskContext: { title: task.title, details: task.details }
        })
      });
      const data = await res.json();
      if (res.ok) {
        onUpdateTask({
          ...task,
          chaosNotes: chaosInput,
          cleanedCheatSheet: data.cleanedNotes
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCleaningNotes(false);
    }
  };

  // Calendar Hijacker Simulation trigger
  const handleTriggerCalendarHijack = () => {
    setIsHijacking(true);
    setTimeout(() => {
      setCalendarEvents(prev => prev.map(evt => ({ ...evt, hijacked: true, title: `🛡️ EMERGENCY FOCUS BLOCK: [${task.title}]`, priority: 'CRITICAL FOCUS' })));
      onUpdateTask({
        ...task,
        calendarHijacked: true
      });
      setIsHijacking(false);
    }, 1800);
  };

  // Web Audio Synthesizer Toggle (Binaural focus frequencies)
  const handleToggleSound = () => {
    if (isPlayingSound) {
      if (audioNodes) {
        audioNodes.ctx.suspend();
      }
      setIsPlayingSound(false);
    } else {
      try {
        let activeCtx = audioNodes?.ctx;
        let nodeObj = audioNodes;
        
        if (!activeCtx) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContextClass();
          
          // Binaural beats (Oscillator 1 = 140Hz, Oscillator 2 = 144Hz for a 4Hz Delta/Theta focus state)
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(140, ctx.currentTime);
          
          const osc2 = ctx.createOscillator();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(144, ctx.currentTime);
          
          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(soundVolume, ctx.currentTime);
          
          // Stereo Panning for the binaural offset
          const panner1 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          const panner2 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          
          if (panner1 && panner2) {
            panner1.pan.setValueAtTime(-1, ctx.currentTime);
            panner2.pan.setValueAtTime(1, ctx.currentTime);
            osc1.connect(panner1).connect(gainNode);
            osc2.connect(panner2).connect(gainNode);
          } else {
            osc1.connect(gainNode);
            osc2.connect(gainNode);
          }
          
          gainNode.connect(ctx.destination);
          
          osc1.start();
          osc2.start();
          
          activeCtx = ctx;
          nodeObj = { ctx, osc1, osc2, gain: gainNode };
          setAudioNodes(nodeObj);
        }
        
        activeCtx.resume();
        setIsPlayingSound(true);
      } catch (e) {
        console.error("Failed to start sound synthesis:", e);
      }
    }
  };

  // Adjust synthesizer volume node
  const handleVolumeChange = (newVol: number) => {
    setSoundVolume(newVol);
    if (audioNodes) {
      audioNodes.gain.gain.setValueAtTime(newVol, audioNodes.ctx.currentTime);
    }
  };

  const completedCount = plan.microTasks.filter(t => t.completed).length;
  const progressPercent = plan.microTasks.length > 0 
    ? Math.round((completedCount / plan.microTasks.length) * 100) 
    : 0;

  // Find the first incomplete micro task for Freeze Mode
  const firstIncompleteTask = plan.microTasks.find(t => !t.completed);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Upper Navigation bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 rounded-full text-xs font-semibold capitalize">
                  {task.type} Rescue Plan
                </span>
                <span className="text-slate-400 text-xs">|</span>
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {task.timeAllocated} Hrs Planned
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 mt-1">{task.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Rescue Mission Progress</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="font-mono text-xs font-bold text-slate-700">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: Tactical sidebar switches */}
        <div className="lg:col-span-1 space-y-6">
          {/* Situation Solver Card */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
            <div className="h-32 overflow-hidden relative bg-slate-900">
              <img 
                src={getSituationImage(task.type)} 
                alt={`${task.type} Solving Illustration`} 
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex items-end p-3">
                <span className="text-[9px] font-black text-white bg-emerald-600 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  Rescue Solved
                </span>
              </div>
            </div>
            <div className="p-4 text-left">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Solving {task.type === 'assignment' ? 'Work stress' : task.type === 'exam' ? 'Exam Study panic' : task.type === 'meeting' ? 'Meeting Clashes' : task.type === 'bill' ? 'Billing deadlines' : task.type === 'presentation' ? 'Stage Anxiety' : 'Commitment Overwhelm'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
                {task.type === 'assignment' 
                  ? 'Breaking work into small actionable micro-goals, drafting outlines to clear blank-page block, and using focused music drones.'
                  : task.type === 'exam'
                  ? 'Isolating critical material with clean cheat-sheets, establishing theta sound-drones for retention, and setting micro-schedules.'
                  : task.type === 'meeting'
                  ? 'Securing solid focus buffers on your calendar, scheduling tactical review tasks, and pre-drafting follow-up emails.'
                  : task.type === 'bill'
                  ? 'Blocking critical transaction time blocks on your agenda, setting instant visual alerts, and organizing billing details securely.'
                  : task.type === 'presentation'
                  ? 'Structuring outlines instantly, creating starter speech slides, and deploying calm, focused bio-drones to ease speaking anxiety.'
                  : 'Synthesizing unorganized thoughts into clear bullet-points and unlocking active focus slots on your schedule.'}
              </p>
            </div>
          </div>

          {/* AI Coach Card */}
          <div className="bg-linear-to-br from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-20 h-20 text-white animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-200">
                AI Coach Tactical Strategy
              </span>
            </div>
            <blockquote className="text-slate-200 italic text-xs leading-relaxed mb-4">
              "{plan.empathyStatement}"
            </blockquote>
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-[11px] text-slate-300">
              ⚡ <strong>Sergeant advice:</strong> Procrastination is a freeze state. Turn off your router/phone block, commit 5 minutes.
            </div>
          </div>

          {/* Quick Action Plan Switches */}
          <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-xs space-y-1">
            <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Core Blueprints
            </div>
            
            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors ${
                activeTab === 'schedule' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Hourly Breakdowns
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors ${
                activeTab === 'checklist' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Atomic Checklist ({completedCount}/{plan.microTasks.length})
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => setActiveTab('hacks')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors ${
                activeTab === 'hacks' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Anti-Procrastination Hacks
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => setActiveTab('draft')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors ${
                activeTab === 'draft' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                Proactive Drafts
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <div className="pt-2 px-3.5 pb-1 text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1 animate-pulse">
              <Flame className="w-3.5 h-3.5" /> High-Utility Override
            </div>

            <button
              onClick={() => setActiveTab('freezemode')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-colors ${
                activeTab === 'freezemode' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                  : 'text-slate-700 hover:bg-rose-50/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500" />
                Freeze-Mode Breaker
              </span>
              <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[9px] rounded-sm font-extrabold uppercase">SOLO</span>
            </button>

            <button
              onClick={() => setActiveTab('dropbox')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors ${
                activeTab === 'dropbox' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                  : 'text-slate-600 hover:bg-emerald-50/20'
              }`}
            >
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                Drop Zone Note Organizer
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors ${
                activeTab === 'calendar' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-indigo-50/20'
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Calendar Hijacker
              </span>
              {task.calendarHijacked ? (
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] rounded-sm font-extrabold uppercase">HIJACKED</span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              )}
            </button>
          </div>
        </div>

        {/* Right workspace panel */}
        <div className="lg:col-span-3">
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Tactical Time Allocation
              </h2>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                A streamlined chronological sequence of intense focus blocks designed to get this done in your remaining window.
              </p>

              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {plan.hourlyPlan.map((step, idx) => (
                  <div key={idx} className="relative pl-10">
                    <span className="absolute left-0 top-1 w-7 h-7 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full flex items-center justify-center font-mono text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">
                        {step.timeSlot}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 mt-1.5">{step.focusTask}</h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        <strong className="text-slate-700">Deliverable:</strong> {step.actionableDeliverable}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                Atomic Action Checklist
              </h2>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                Procrastination thrives on big, scary titles. Check off these microscopic, highly defined micro-tasks one by one to build momentum.
              </p>

              <div className="space-y-3">
                {plan.microTasks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleToggleMicroTask(item.id)}
                    className={`w-full text-left p-4 rounded-xl border flex items-start gap-3 transition-all ${
                      item.completed 
                        ? 'bg-slate-50 border-slate-100 opacity-60 line-through text-slate-400' 
                        : 'bg-white border-slate-200 hover:border-indigo-200 text-slate-700 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {item.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-500 fill-emerald-50/50" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                      )}
                    </div>
                    <span className="text-xs font-semibold">{item.task}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hacks' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
                Cognitive Procrastination Hacks
              </h2>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                Psychological triggers specifically suited for your category of task to trick your brain into taking immediate action.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.focusHacks.map((hack, idx) => (
                  <div key={idx} className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 flex gap-3">
                    <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg h-fit">
                      <Lightbulb className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-[10px] font-bold text-amber-900 uppercase tracking-wide">Focus Hack #{idx + 1}</h4>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{hack}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'draft' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-600" />
                Proactive Blank-Page Assistant
              </h2>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                Stuck on how to start? Use AI to generate a structural outline, write an introductory launch paragraph, or draft a polite extension email right now.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => handleGenerateDraft('outline')}
                  className="p-4 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center text-center gap-2 transition-all bg-white group hover:bg-slate-50/50"
                >
                  <BookOpen className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800">1. Instant Outline</span>
                  <span className="text-[10px] text-slate-400">Section headers and structure</span>
                </button>

                <button
                  onClick={() => handleGenerateDraft('starter_paragraph')}
                  className="p-4 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center text-center gap-2 transition-all bg-white group hover:bg-slate-50/50"
                >
                  <PenTool className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800">2. Starter Draft</span>
                  <span className="text-[10px] text-slate-400">First paragraph generation</span>
                </button>

                <button
                  onClick={() => handleGenerateDraft('email_extension')}
                  className="p-4 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center text-center gap-2 transition-all bg-white group hover:bg-slate-50/50"
                >
                  <Mail className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800">3. Extension Request</span>
                  <span className="text-[10px] text-slate-400">Professional request email</span>
                </button>
              </div>

              {draftType && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">
                      Generated {draftType.replace('_', ' ')}
                    </span>
                    {draftContent && (
                      <button
                        onClick={() => handleCopyDraft(draftContent)}
                        className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors font-medium text-slate-600"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                      </button>
                    )}
                  </div>

                  {isGeneratingDraft ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2">
                      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                      <span className="text-xs text-slate-400 font-medium">Drafting emergency materials...</span>
                    </div>
                  ) : (
                    <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto">
                      {draftContent}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'freezemode' && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-rose-500 flex items-center gap-2">
                    <Activity className="w-5 h-5 animate-pulse" />
                    Psychological Freeze-Mode Breaker
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Everything else is hidden. Focus on exactly ONE micro-step and clear your blank page blocker.
                  </p>
                </div>

                {/* Synth Player */}
                <div className="bg-slate-800 rounded-xl p-3 border border-slate-700/60 flex items-center gap-3">
                  <button
                    onClick={handleToggleSound}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                      isPlayingSound ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300'
                    }`}
                    title="Toggle Cognitive Focus Drone"
                  >
                    {isPlayingSound ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-rose-400" />
                      Ambient Focus Drone
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="range"
                        min="0.05"
                        max="0.4"
                        step="0.05"
                        value={soundVolume}
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        className="w-16 accent-rose-500 h-1 bg-slate-600 rounded-lg cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{Math.round(soundVolume * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Single Atomic Task Window */}
              <div className="bg-linear-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-4">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">
                  Active Single-Focus Commandment
                </span>
                {firstIncompleteTask ? (
                  <div className="space-y-4">
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                      "{firstIncompleteTask.task}"
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Block out all secondary ideas. Dedicate just 3 minutes right now.
                    </p>
                    <button
                      onClick={() => handleToggleMicroTask(firstIncompleteTask.id)}
                      className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Step Completed, Advance Me!
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="text-base font-bold text-white">All Atomic Steps Checked!</h3>
                    <p className="text-slate-400 text-xs">You conquered the freeze loop for this task!</p>
                  </div>
                )}
              </div>

              {/* Interactive Co-Drafting Split Screen */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-rose-400" />
                    Interactive Co-Drafting (Unblock the page)
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Type your chaotic, raw, unorganized thoughts. AI will elevate it into clean, structured paragraphs instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Raw Brain Dump</label>
                    <textarea
                      value={messyInput}
                      onChange={(e) => setMessyInput(e.target.value)}
                      placeholder="e.g. chemistry crystallization is when molecules line up into grids. copper sulfate starts blue. explain this but sound professional..."
                      rows={5}
                      className="w-full px-3 py-2 border border-slate-800 bg-slate-950 text-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder:text-slate-600"
                    />
                    <button
                      onClick={handleElevateProse}
                      disabled={isElevatingProse || !messyInput.trim()}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 inline-flex items-center justify-center gap-1.5"
                    >
                      {isElevatingProse ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Elevating thoughts...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Convert to Professional Prose
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Polished Masterpiece</label>
                      {polishedProse && (
                        <button
                          onClick={() => handleCopyDraft(polishedProse)}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      )}
                    </div>
                    <div className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl h-[166px] overflow-y-auto text-xs text-slate-300 font-sans leading-relaxed">
                      {polishedProse ? (
                        polishedProse
                      ) : (
                        <span className="text-slate-600 italic">Formatted paragraph will appear here...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dropbox' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-600" />
                  "Drop Zone" Context Ingestion
                </h2>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Have chaotic notes, textbook screenshots, or random research copied from the web? Dump them here. Our AI will clean the noise and construct a master Cheat Sheet.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Paste Context / Chaotic Notes
                  </label>
                  <textarea
                    value={chaosInput}
                    onChange={(e) => setChaosInput(e.target.value)}
                    placeholder="Blindly dump links, random textbook paragraphs, syllabus requirements, or meeting transcripts here..."
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <button
                  onClick={handleCleanNotes}
                  disabled={isCleaningNotes || !chaosInput.trim()}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5"
                >
                  {isCleaningNotes ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Organizing Chaos...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-100" /> De-clutter Notes & Create Cheat Sheet
                    </>
                  )}
                </button>

                {task.cleanedCheatSheet && (
                  <div className="mt-6 border-t border-slate-100 pt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        AI Organized Cheat Sheet
                      </h3>
                      <button
                        onClick={() => handleCopyDraft(task.cleanedCheatSheet || '')}
                        className="text-[11px] text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" /> {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 max-h-96 overflow-y-auto">
                      <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                        {task.cleanedCheatSheet}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Autonomous Calendar Hijacker (Time Block)
                </h2>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Procrastination is often caused by a lack of strict time boundaries. Scan your day's low-priority distraction events and hard-block them into official, uninterrupted Focus Rescue Slots.
                </p>
              </div>

              {/* Event Timeline */}
              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50">
                {calendarEvents.map((evt) => (
                  <div 
                    key={evt.id} 
                    className={`p-4 flex items-center justify-between transition-all ${
                      evt.hijacked ? 'bg-emerald-50/50' : 'bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{evt.time}</span>
                      <h4 className={`text-xs font-bold ${evt.hijacked ? 'text-emerald-800' : 'text-slate-700'}`}>
                        {evt.title}
                      </h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded-sm font-extrabold text-[9px] uppercase tracking-wider ${
                      evt.hijacked 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-50 text-rose-600 animate-pulse'
                    }`}>
                      {evt.priority}
                    </span>
                  </div>
                ))}
              </div>

              {/* Hijack Trigger */}
              <button
                onClick={handleTriggerCalendarHijack}
                disabled={isHijacking || task.calendarHijacked}
                className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  task.calendarHijacked
                    ? 'bg-emerald-50 border border-emerald-100 text-emerald-700 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                }`}
              >
                {isHijacking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rerouting timeline blocks & notifying clients...</span>
                  </>
                ) : task.calendarHijacked ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Emergency Focus Slots Hard-Blocked on Calendar!</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-indigo-200" />
                    <span>Hijack Calendar Distractions & Lock Time</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
