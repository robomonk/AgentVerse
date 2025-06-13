'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { selectAgent, type SelectAgentInput, type SelectAgentOutput } from '@/ai/flows/select-agent';
import type { Agent, Message } from '@/lib/types';
import { DEFAULT_AGENTS } from '@/lib/constants';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import AgentConfigurationPanel from '@/components/AgentConfigurationPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Settings, Loader2, Bot } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';

function formatConversationHistory(messages: Message[]): string {
  return messages.map(msg => `${msg.sender === 'user' ? 'User' : msg.sender}: ${msg.text}`).join('\n\n');
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAgentToggle = (agentId: string, isActive: boolean) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId ? { ...agent, isActive } : agent
      )
    );
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    const activeAgents = agents.filter(agent => agent.isActive);
    if (activeAgents.length === 0) {
      toast({
        title: "No active agents",
        description: "Please activate at least one agent to respond.",
        variant: "destructive",
      });
      setIsLoading(false);
      // Add a bot message indicating no active agents
      const noAgentBotMessage: Message = {
        id: Date.now().toString() + '_system',
        text: "I can't respond as no agents are currently active. Please select an agent from the sidebar.",
        sender: 'System', // Or a generic bot name
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, noAgentBotMessage]);
      return;
    }

    const conversationHistoryForAI = formatConversationHistory([...messages, userMessage]);
    const agentDescriptionsForAI = activeAgents.map(agent => ({
      name: agent.name,
      description: agent.description,
    }));

    const selectAgentInput: SelectAgentInput = {
      conversationHistory: conversationHistoryForAI,
      availableAgents: agentDescriptionsForAI,
      userQuery: text,
    };

    try {
      const { selectedAgentName, reasoning }: SelectAgentOutput = await selectAgent(selectAgentInput);
      
      // Simulate agent response
      const agentResponseText = `Hello, I am ${selectedAgentName}. Based on the reasoning: "${reasoning}", I am responding to your query. (This is a simulated response.)`;
      const agentMessage: Message = {
        id: Date.now().toString() + '_agent',
        text: agentResponseText,
        sender: selectedAgentName,
        timestamp: new Date(),
        reasoning: reasoning,
      };
      setMessages(prevMessages => [...prevMessages, agentMessage]);

    } catch (error) {
      console.error('Error selecting agent or getting response:', error);
      toast({
        title: "Error",
        description: "Could not get a response from an agent. Please try again.",
        variant: "destructive",
      });
       const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        text: "Sorry, I encountered an error trying to process your request.",
        sender: 'System',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="h-7 w-7 text-sidebar-primary" />
            <span className="text-xl font-semibold text-sidebar-foreground font-headline">AgentVerse</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <SidebarGroup className="p-2">
             <SidebarGroupLabel className="text-sidebar-foreground/70">Agents</SidebarGroupLabel>
            <AgentConfigurationPanel agents={agents} onAgentToggle={handleAgentToggle} />
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                 <Link href="/rules" legacyBehavior passHref>
                    <SidebarMenuButton variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <Settings className="h-4 w-4 mr-2" />
                        Agent Rules
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <p className="text-xs text-sidebar-foreground/60">&copy; {new Date().getFullYear()} AgentVerse</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <header className="p-4 border-b flex items-center sticky top-0 bg-background/90 backdrop-blur-sm z-10">
            <SidebarTrigger className="mr-2 md:hidden" /> {/* Mobile trigger */}
            <Bot className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-xl font-semibold font-headline text-foreground">Agent Conversation</h1>
          </header>
          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="max-w-3xl mx-auto w-full">
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} allAgents={agents} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                   <div className="flex items-end gap-2">
                    <AgentAvatar agent={undefined} size="sm" /> {/* Generic Bot Avatar */}
                    <div className="p-3 rounded-xl shadow-md bg-card text-card-foreground">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
