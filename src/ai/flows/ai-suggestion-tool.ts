"use server";
/**
 * @fileOverview This file implements the AI suggestion tool for improving resume scores.
 *
 * - getResumeSuggestions - A function that takes resume file data as input and returns AI-powered suggestions.
 * - ResumeSuggestionsInput - The input type for the getResumeSuggestions function.
 * - ResumeSuggestionsOutput - The return type for the getResumeSuggestions function.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
const ResumeSuggestionsInputSchema = z.object({
  resumeFile: z
    .string()
    .describe(
      "The resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ResumeSuggestionsInput = z.infer<
  typeof ResumeSuggestionsInputSchema
>;
const SuggestionItemSchema = z.object({
  originalText: z
    .string()
    .optional()
    .describe("The original text from the resume that should be replaced."),
  suggestion: z
    .string()
    .describe("The AI-powered suggestion for improving the resume."),
  reason: z
    .string()
    .describe("The reason why this suggestion would improve the resume score."),
});
const SuggestionCategorySchema = z.object({
  field: z
    .string()
    .describe(
      "The resume field to which the suggestion applies (e.g., Skills, Experience, Education). This should be a general category."
    ),
  suggestions: z
    .array(SuggestionItemSchema)
    .describe("An array of specific suggestions for this field."),
});
const ResumeSuggestionsOutputSchema = z
  .array(SuggestionCategorySchema)
  .describe(
    "An array of AI-powered suggestions for improving the resume score, grouped by field."
  );
export type ResumeSuggestionsOutput = z.infer<
  typeof ResumeSuggestionsOutputSchema
>;
export async function getResumeSuggestions(
  input: ResumeSuggestionsInput
): Promise<ResumeSuggestionsOutput> {
  return resumeSuggestionsFlow(input);
}
const resumeSuggestionsPrompt = ai.definePrompt({
  name: "resumeSuggestionsPrompt",
  input: { schema: ResumeSuggestionsInputSchema },
  output: { schema: ResumeSuggestionsOutputSchema },
  prompt: `You are an AI resume optimization tool. Your task is to analyze a resume and provide suggestions to improve its ATS score.

Analyze the following resume and provide a list of specific, actionable suggestions.
Group these suggestions by a general field name (e.g., "Skills", "Experience", "Education", "Projects", "Summary").
For each general field, provide an array of one or more individual suggestions.

Each individual suggestion must contain:
1. 'originalText': The exact, specific text from the resume that should be replaced. If no specific text can be identified for replacement (e.g., adding a new section), leave the 'originalText' field empty.
2. 'suggestion': The recommended new text or change. This should be a specific, actionable improvement for the 'originalText'.
3. 'reason': The justification for why this change improves the resume.

Resume File:
{{media url=resumeFile}}

Format your response as a JSON array of suggestion categories.
  `,
});
const resumeSuggestionsFlow = ai.defineFlow(
  {
    name: "resumeSuggestionsFlow",
    inputSchema: ResumeSuggestionsInputSchema,
    outputSchema: ResumeSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await resumeSuggestionsPrompt(input);
    return output!;
  }
);
