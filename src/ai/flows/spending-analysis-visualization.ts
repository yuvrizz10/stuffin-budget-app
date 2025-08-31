'use server';

/**
 * @fileOverview This file defines a Genkit flow for visualizing spending analysis.
 *
 * - visualizeSpendingAnalysis - A function that takes user's financial data and provides visual representations with AI-powered summaries.
 * - VisualizeSpendingAnalysisInput - The input type for the visualizeSpendingAnalysis function.
 * - VisualizeSpendingAnalysisOutput - The return type for the visualizeSpendingAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualizeSpendingAnalysisInputSchema = z.object({
  income: z
    .number()
    .describe('The total income of the user for the given period.'),
  expenses: z.array(
    z.object({
      category: z.string().describe('The category of the expense.'),
      amount: z.number().describe('The amount spent in that category.'),
      date: z.string().describe('The date when the expense was made.'),
    })
  ).describe('An array of expenses with category, amount, and date.'),
  budgets: z.array(
    z.object({
      category: z.string().describe('The category of the budget.'),
      amount: z.number().describe('The budgeted amount for that category.'),
    })
  ).describe('An array of budgets with category and amount.'),
});
export type VisualizeSpendingAnalysisInput = z.infer<typeof VisualizeSpendingAnalysisInputSchema>;

const VisualizeSpendingAnalysisOutputSchema = z.object({
  summary: z.string().describe('An AI-powered summary of the user spending habits.'),
  visualizationData: z.string().describe('Data for visual representations of spending patterns.'),
});
export type VisualizeSpendingAnalysisOutput = z.infer<typeof VisualizeSpendingAnalysisOutputSchema>;

export async function visualizeSpendingAnalysis(input: VisualizeSpendingAnalysisInput): Promise<VisualizeSpendingAnalysisOutput> {
  return visualizeSpendingAnalysisFlow(input);
}

const spendingAnalysisPrompt = ai.definePrompt({
  name: 'spendingAnalysisPrompt',
  input: {schema: VisualizeSpendingAnalysisInputSchema},
  output: {schema: VisualizeSpendingAnalysisOutputSchema},
  prompt: `You are an AI assistant that analyzes user spending habits and provides insights.

  Analyze the following financial data and provide a summary of the user's spending habits.
  Also, provide data that can be used to visualize the spending patterns.

  Income: {{{income}}}
  Expenses: {{#each expenses}}- Category: {{{category}}}, Amount: {{{amount}}}, Date: {{{date}}}\n{{/each}}
  Budgets: {{#each budgets}}- Category: {{{category}}}, Amount: {{{amount}}}\n{{/each}}

  Summary:
  Visualization Data:`, // TODO: decide the exact structure for passing data to frontend.
});

const visualizeSpendingAnalysisFlow = ai.defineFlow(
  {
    name: 'visualizeSpendingAnalysisFlow',
    inputSchema: VisualizeSpendingAnalysisInputSchema,
    outputSchema: VisualizeSpendingAnalysisOutputSchema,
  },
  async input => {
    const {output} = await spendingAnalysisPrompt(input);
    return output!;
  }
);
