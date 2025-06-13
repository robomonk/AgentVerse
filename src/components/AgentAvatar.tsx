import type { Agent } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot } from 'lucide-react'; 

interface AgentAvatarProps {
  agent?: Agent; // Agent can be undefined if message is from an unknown agent
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AgentAvatar({ agent, size = 'md', className }: AgentAvatarProps) {
  const avatarSizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
  const iconSizes = { sm: 18, md: 20, lg: 24 };

  const IconComponent = agent?.icon || Bot;

  return (
    <Avatar className={`${avatarSizes[size]} ${className} shadow-sm`}>
      {agent?.avatarUrl ? (
        <AvatarImage src={agent.avatarUrl} alt={agent.name} data-ai-hint={agent.dataAiHint} />
      ) : null}
      <AvatarFallback>
        <IconComponent size={iconSizes[size]} aria-label={`${agent?.name || 'Agent'} Avatar`} />
      </AvatarFallback>
    </Avatar>
  );
}
