export type TaskType = 'assignment' | 'meeting' | 'bill' | 'exam' | 'presentation' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'missed';

export interface HourlyStep {
  timeSlot: string;
  focusTask: string;
  actionableDeliverable: string;
}

export interface MicroTaskItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface EmergencyPlan {
  empathyStatement: string;
  hourlyPlan: HourlyStep[];
  microTasks: MicroTaskItem[];
  focusHacks: string[];
  customDrafts?: {
    outline?: string;
    email_extension?: string;
    starter_paragraph?: string;
  };
}

export interface Task {
  id: string;
  title: string;
  details: string;
  deadline: string; // ISO format
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  timeAllocated: number; // estimated hours
  panicIndex: number; // calculated 0-100
  emergencyPlan: EmergencyPlan | null;
  createdAt: string;
  chaosNotes?: string;
  cleanedCheatSheet?: string;
  calendarHijacked?: boolean;
}

export interface StreakStats {
  currentStreak: number;
  totalSaved: number;
  totalTasks: number;
  missedCount: number;
  crisisPoints: number;
  streakInsuranceActive?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type CoachPersonality = 'tough' | 'cheerleader' | 'realist';
