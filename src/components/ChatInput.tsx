'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (messageText: string) => Promise<void>;
  isLoading: boolean;
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    await onSubmit(inputText.trim());
    setInputText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-4 bg-background">
      <Input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow rounded-full focus-visible:ring-accent"
        disabled={isLoading}
        aria-label="Chat message input"
      />
      <Button type="submit" size="icon" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || !inputText.trim()}>
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
