'use server';

/**
 * @fileOverview Automatically selects the most appropriate agent to respond based on the conversation history and agent descriptions.
 *
 * - selectAgent - A function that handles the agent selection process.
 * - SelectAgentInput - The input type for the selectAgent function.
 * - SelectAgentOutput - The return type for the selectAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgentDescriptionSchema = z.object({
  name: z.string().describe('The name of the agent.'),
  description: z.string().describe('A detailed description of the agent, including its expertise and responsibilities.'),
});

const SelectAgentInputSchema = z.object({
  conversationHistory: z.string().describe('The complete conversation history between the user and all agents.'),
  availableAgents: z.array(AgentDescriptionSchema).describe('An array of available agents with their descriptions.'),
  userQuery: z.string().describe('The current user query.'),
});
export type SelectAgentInput = z.infer<typeof SelectAgentInputSchema>;

const SelectAgentOutputSchema = z.object({
  selectedAgentName: z.string().describe('The name of the agent that is most appropriate to respond.'),
  reasoning: z.string().describe('The reasoning behind selecting the agent.'),
});
export type SelectAgentOutput = z.infer<typeof SelectAgentOutputSchema>;

export async function selectAgent(input: SelectAgentInput): Promise<SelectAgentOutput> {
  return selectAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'selectAgentPrompt',
  input: {schema: SelectAgentInputSchema},
  output: {schema: SelectAgentOutputSchema},
  prompt: `Given the following conversation history:

{{conversationHistory}}

And the following available agents:

{{#each availableAgents}}
  Name: {{this.name}}
  Description: {{this.description}}
{{/each}}

And the following user query:

{{userQuery}}

Determine which agent is most appropriate to respond to the user query. Explain your reasoning and then state the name of the selected agent.

Output the selected agent's name and reasoning in JSON format:
{
  "selectedAgentName": "[name of selected agent]",
  "reasoning": "[reasoning for selecting the agent]"
}
`,
});

const selectAgentFlow = ai.defineFlow(
  {
    name: 'selectAgentFlow',
    inputSchema: SelectAgentInputSchema,
    outputSchema: SelectAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
