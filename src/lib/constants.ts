import type { Agent } from './types';
import { Users, PenTool, BarChart3, BrainCircuit, Settings } from 'lucide-react';

export const DEFAULT_AGENTS: Agent[] = [
  { 
    id: 'support-bot', 
    name: 'SupportBot', 
    description: 'Expert in troubleshooting and customer support queries. Provides helpful solutions and guidance.', 
    icon: Users, 
    dataAiHint: 'customer service', 
    isActive: true 
  },
  { 
    id: 'creative-writer', 
    name: 'CreativeWriter', 
    description: 'Generates creative text formats, like poems, code, scripts, musical pieces, email, letters, etc.', 
    icon: PenTool, 
    dataAiHint: 'writing idea', 
    isActive: true 
  },
  { 
    id: 'data-analyst', 
    name: 'DataAnalyst', 
    description: 'Helps with data analysis, visualization, and extracting insights from datasets.', 
    icon: BarChart3, 
    dataAiHint: 'statistics charts', 
    isActive: false 
  },
  { 
    id: 'planner-bot', 
    name: 'PlannerBot', 
    description: 'Assists in planning tasks, schedules, and organizing projects. Provides reminders and tracks progress.', 
    icon: BrainCircuit, 
    dataAiHint: 'calendar organization', 
    isActive: true 
  },
];

// This constant is not directly used in the components provided, but kept for potential future use.
export const USER_AVATAR_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" class="h-full w-full"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
