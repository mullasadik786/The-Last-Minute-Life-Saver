import React, { useState } from 'react';
import { Task, TaskType, TaskPriority } from '../types';
import { X, AlertCircle, Clock } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSave: (taskData: Omit<Task, 'id' | 'panicIndex' | 'emergencyPlan' | 'createdAt'> & { id?: string }) => void;
  onClose: () => void;
}

export default function TaskForm({ task, onSave, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [details, setDetails] = useState(task?.details || '');
  
  // Format Date for datetime-local input
  const getFormattedDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    // adjust for local timezone offset
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().slice(0, 16);
  };

  const [deadline, setDeadline] = useState(getFormattedDate(task?.deadline));
  const [type, setType] = useState<TaskType>(task?.type || 'assignment');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [timeAllocated, setTimeAllocated] = useState<number>(task?.timeAllocated || 2);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!deadline) {
      setError('Deadline date and time are required');
      return;
    }
    if (timeAllocated <= 0) {
      setError('Please estimate at least some effort (e.g. 0.5 hours)');
      return;
    }

    onSave({
      id: task?.id,
      title: title.trim(),
      details: details.trim(),
      deadline: new Date(deadline).toISOString(),
      type,
      priority,
      status: task?.status || 'pending',
      timeAllocated: Number(timeAllocated),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            {task ? 'Edit Impending Deadline' : 'Register New Deadline'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Task or Commitment Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. History Term Paper, Server Migration, Electric Bill"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Impending Deadline (Date & Time) *
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => { setDeadline(e.target.value); setError(''); }}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-700 bg-white"
              >
                <option value="assignment">Assignment / Work</option>
                <option value="exam">Exam Study</option>
                <option value="meeting">Meeting / Interview</option>
                <option value="bill">Bill Payment</option>
                <option value="presentation">Presentation</option>
                <option value="other">Other Commitment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Impact / Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-700 bg-white"
              >
                <option value="low">Low Impact</option>
                <option value="medium">Medium Impact</option>
                <option value="high">High Impact</option>
                <option value="critical">Critical / Life-defining</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Est. Focused Workload (Hours) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={timeAllocated}
                onChange={(e) => setTimeAllocated(Number(e.target.value))}
                className="w-full pl-3.5 pr-12 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                Hours
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              The AI uses this to calculate your Panic Index based on remaining time.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Description & Context
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide prompt details, resources, grading rubric, or account details to help the AI generate tailored blueprints..."
              rows={3}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm placeholder:text-slate-400 text-slate-800"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors text-sm font-medium shadow-sm"
            >
              {task ? 'Update Task' : 'Add to Hotline Radar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
