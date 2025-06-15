'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

// This is a placeholder for a server action.
// In a real app, this would save the rules to a database or configuration file.
async function saveAgentRules(rules: string): Promise<{ success: boolean; message: string }> {
  console.log('Saving agent rules:', rules);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // For now, always return success
  if (rules.length === 0) {
    return { success: false, message: 'Rules cannot be empty.' };
  }
  return { success: true, message: 'Agent rules saved successfully!' };
}


export default function AgentRulesPage() {
  const [rules, setRules] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const result = await saveAgentRules(rules);
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save agent rules. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-2xl">
        <Button variant="outline" asChild className="mb-6">
          <Link href="/" legacyBehavior>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chat
          </Link>
        </Button>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Define Agent Rules</CardTitle>
            <CardDescription>
              Use natural language to define rules and guidelines for how agents should behave or prioritize tasks.
              These rules will influence agent decision-making.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Textarea
                placeholder="e.g., 'Always respond politely.' or 'If user asks about pricing, refer to SupportBot.'"
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                rows={10}
                className="resize-none focus-visible:ring-accent"
                aria-label="Agent rules input"
                disabled={isSaving}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSaving || !rules.trim()}>
                {isSaving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-pulse" />
                    Saving Rules...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Rules
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
