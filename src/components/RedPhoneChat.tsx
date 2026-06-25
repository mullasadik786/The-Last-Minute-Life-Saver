import React, { useState, useRef, useEffect } from 'react';
import { Task, ChatMessage, CoachPersonality } from '../types';
import { Send, Phone, User, ShieldAlert, Sparkles, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface RedPhoneChatProps {
  task?: Task | null;
  onClose: () => void;
}

export default function RedPhoneChat({ task, onClose }: RedPhoneChatProps) {
  const [personality, setPersonality] = useState<CoachPersonality>('realist');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting based on selected personality
  useEffect(() => {
    let greeting = '';
    if (personality === 'tough') {
      greeting = "🚨 DROP EVERYTHING. Sergeant here. I don't care about excuses, I care about results. Turn off your notifications, shut your tabs, and tell me: what is the absolute smallest action we can take in the next 120 seconds? Tell me your block and let's crush it.";
    } else if (personality === 'cheerleader') {
      greeting = "🌸 Hey there, breathe with me. It is completely okay to feel overwhelmed. Procrastination is just anxiety in disguise, not a character flaw. Let's tackle this together, step by tiny step. What's making you feel stuck right now?";
    } else {
      greeting = "📊 Crisis Hotline initialized. I have reviewed your remaining window. Let's look at the data objectively. No fluff. Tell me what your roadblock is, and we will formulate the highest-ROI move for your next 10 minutes.";
    }

    setMessages([
      {
        id: 'initial',
        role: 'assistant',
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [personality]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setError('');

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/red-phone-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          personality,
          taskContext: task ? { title: task.title, details: task.details, type: task.type, deadline: task.deadline } : null
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setError(data.error || 'The Red Phone encountered static. Try re-sending.');
      }
    } catch (e) {
      console.error(e);
      setError('Hotline offline. Check your server connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const panicPresets = [
    "I have less than 2 hours and I haven't started!",
    "My anxiety is peaking and I am completely frozen.",
    "Tell me the absolute first sentence or action to take.",
    "I'm distracted by social media. Help me lock in."
  ];

  return (
    <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl border-l border-slate-100 flex flex-col z-50 animate-in slide-in-from-right duration-300">
      {/* Hotline Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center animate-pulse">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm tracking-wide uppercase text-rose-500">Crisis Red Phone</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-slate-400">Direct Procrastination Rescue</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors text-xs font-semibold"
        >
          Close
        </button>
      </div>

      {/* active context indicator */}
      {task && (
        <div className="bg-rose-50 border-b border-rose-100 px-4 py-2.5 flex items-center justify-between text-xs">
          <span className="text-rose-800 font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-rose-600" />
            Active Incident: <strong>{task.title}</strong>
          </span>
          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded-sm font-bold uppercase text-[9px]">
            LOCKED CONTEXT
          </span>
        </div>
      )}

      {/* Personality Selector */}
      <div className="border-b border-slate-100 p-3 bg-slate-50/50 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coach Voice:</span>
        <div className="flex bg-slate-200/60 rounded-lg p-0.5 w-full max-w-[280px]">
          <button
            onClick={() => setPersonality('tough')}
            className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${
              personality === 'tough' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Sergeant
          </button>
          <button
            onClick={() => setPersonality('cheerleader')}
            className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${
              personality === 'cheerleader' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Cheerleader
          </button>
          <button
            onClick={() => setPersonality('realist')}
            className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${
              personality === 'realist' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Realist
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div 
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[10px] font-semibold text-slate-400">
                {m.role === 'user' ? 'You' : `${personality.charAt(0).toUpperCase() + personality.slice(1)} Coach`}
              </span>
              <span className="text-[9px] text-slate-300">• {m.timestamp}</span>
            </div>
            
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-3xs ${
              m.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-1">
            <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-xs font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
              <span>{personality.charAt(0).toUpperCase() + personality.slice(1)} is thinking...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button 
              onClick={() => {
                const lastUser = [...messages].reverse().find(m => m.role === 'user');
                if (lastUser) handleSendMessage(lastUser.content);
              }}
              className="ml-auto underline flex items-center gap-1 hover:text-red-800"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Panic Preset Buttons */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Panic Presets (Tap to send):</span>
        <div className="flex flex-wrap gap-1.5">
          {panicPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(preset)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg text-[11px] text-slate-700 hover:text-indigo-600 font-medium text-left transition-colors shadow-3xs"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
        className="p-3 border-t border-slate-100 bg-white flex gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isLoading ? "Please wait..." : "Type what's blocking you..."}
          disabled={isLoading}
          className="flex-1 px-4 py-2 text-sm border border-slate-200 focus:border-slate-800 rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 active:bg-black transition-colors disabled:opacity-40 disabled:hover:bg-slate-900 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
