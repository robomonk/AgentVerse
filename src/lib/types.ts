import type { LucideIcon } from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string; // URL for a custom image avatar
  dataAiHint?: string; // For placeholder image generation if avatarUrl is a placeholder
  icon?: LucideIcon; // Lucide icon to represent the agent
  isActive: boolean; // Whether the agent is currently selected/active in the chat
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | string; // 'user' or agent.name (could be agent.id if names are not unique)
  timestamp: Date;
  reasoning?: string; // Optional: for AI agent selection reasoning
}
