import type { Agent, Message } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';
import AgentAvatar from './AgentAvatar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessageProps {
  message: Message;
  allAgents: Agent[];
}

export default function ChatMessage({ message, allAgents }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const agent = !isUser ? allAgents.find(a => a.name === message.sender) : null;

  return (
    <div className={`flex mb-4 animate-in fade-in slide-in-from-bottom-5 duration-300 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`} style={{ maxWidth: '80%' }}>
        {!isUser && (
          <AgentAvatar agent={agent} size="sm" />
        )}
        {isUser && (
           <Avatar className="h-8 w-8 shadow-sm">
             <AvatarFallback className="bg-accent text-accent-foreground">
               <User size={18} aria-label="User Avatar" />
             </AvatarFallback>
           </Avatar>
        )}
        <Card className={`p-3 rounded-xl shadow-md ${isUser ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground'}`}>
          {!isUser && agent && (
            <p className="text-xs font-semibold mb-1">{agent.name}</p>
          )}
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          {message.reasoning && !isUser && (
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted/50">
              <em>Reasoning: {message.reasoning}</em>
            </p>
          )}
          <p className={`text-xs mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'} text-right`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </Card>
      </div>
    </div>
  );
}
