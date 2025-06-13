import type { Agent } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AgentAvatar from './AgentAvatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import React from 'react';

interface AgentConfigurationPanelProps {
  agents: Agent[];
  onAgentToggle: (agentId: string, isActive: boolean) => void;
}

export default function AgentConfigurationPanel({ agents, onAgentToggle }: AgentConfigurationPanelProps) {
  return (
    <div className="p-1">
      <ScrollArea className="h-full"> {/* Adjust height dynamically or set fixed */}
        <div className="space-y-1">
          {agents.map((agent, index) => (
            <React.Fragment key={agent.id}>
              <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-sidebar-accent/80 transition-colors cursor-pointer" onClick={() => onAgentToggle(agent.id, !agent.isActive)}>
                <AgentAvatar agent={agent} size="sm" className="mt-1" />
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`agent-${agent.id}`} className="font-medium text-sm text-sidebar-foreground cursor-pointer">
                      {agent.name}
                    </Label>
                    <Checkbox
                      id={`agent-${agent.id}`}
                      checked={agent.isActive}
                      onCheckedChange={(checked) => onAgentToggle(agent.id, !!checked)}
                      className="border-sidebar-border data-[state=checked]:bg-sidebar-primary data-[state=checked]:text-sidebar-primary-foreground"
                      aria-label={`Toggle agent ${agent.name}`}
                    />
                  </div>
                  <p className="text-xs text-sidebar-foreground/70 mt-0.5">{agent.description}</p>
                </div>
              </div>
              {index < agents.length - 1 && <Separator className="my-1 bg-sidebar-border/50" />}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
