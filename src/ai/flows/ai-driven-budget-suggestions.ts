'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-driven budget suggestions based on user spending habits and income.
 *
 * - `getBudgetSuggestions` -  A function that takes user's financial data and returns AI-optimized budget suggestions.
 * - `BudgetSuggestionsInput` - The input type for the getBudgetSuggestions function.
 * - `BudgetSuggestionsOutput` - The return type for the getBudgetSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the budget suggestions flow
const BudgetSuggestionsInputSchema = z.object({
  income: z.number().describe('The user monthly income.'),
  totalBudget: z.number().describe('The user total budget.'),
  spendingHabits: z
    .record(z.number())
    .describe('A record of the user spending habits, with category names as keys and spending amounts as values.'),
});
export type BudgetSuggestionsInput = z.infer<typeof BudgetSuggestionsInputSchema>;

// Define the output schema for the budget suggestions flow
const BudgetSuggestionsOutputSchema = z.record(z.number()).describe('AI-optimized budget suggestions for each spending category.');
export type BudgetSuggestionsOutput = z.infer<typeof BudgetSuggestionsOutputSchema>;

// Exported function to get budget suggestions
export async function getBudgetSuggestions(input: BudgetSuggestionsInput): Promise<BudgetSuggestionsOutput> {
  return aiDrivenBudgetSuggestionsFlow(input);
}

// Define the prompt for generating budget suggestions
const budgetSuggestionsPrompt = ai.definePrompt({
  name: 'budgetSuggestionsPrompt',
  input: {schema: BudgetSuggestionsInputSchema},
  output: {schema: BudgetSuggestionsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's income, total budget, and spending habits to provide budget suggestions for each category.

Keep the total spending BELOW the specified budget ceiling, but attempt to allocate all of the budget.

Income: {{income}}
Total Budget: {{totalBudget}}
Spending Habits: {{#each spendingHabits}}{{@key}}: {{this}}\n{{/each}}

Provide budget suggestions for each category, optimizing based on spending habits while ensuring the total budget is not exceeded. The output should be a JSON object where each key is the category and the value is the suggested budget for that category. Make sure all category keys from spending habits are present.
`,
});

// Define the Genkit flow for generating budget suggestions
const aiDrivenBudgetSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiDrivenBudgetSuggestionsFlow',
    inputSchema: BudgetSuggestionsInputSchema,
    outputSchema: BudgetSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await budgetSuggestionsPrompt(input);
    return output!;
  }
);
