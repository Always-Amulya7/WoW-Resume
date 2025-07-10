"use server";
/**
 * @fileOverview This file implements the AI summary generation tool for resumes.
 *
 * - getResumeSummary - A function that takes resume file data as input and returns an AI-powered summary.
 * - ResumeSummaryInput - The input type for the getResumeSummary function.
 * - ResumeSummaryOutput - The return type for the getResumeSummary function.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
const ResumeSummaryInputSchema = z.object({
  resumeFile: z
    .string()
    .describe(
      "The resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ResumeSummaryInput = z.infer<typeof ResumeSummaryInputSchema>;
const ResumeSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe("A professional summary generated from the resume."),
});
export type ResumeSummaryOutput = z.infer<typeof ResumeSummaryOutputSchema>;
export async function getResumeSummary(
  input: ResumeSummaryInput
): Promise<ResumeSummaryOutput> {
  return resumeSummaryFlow(input);
}
const resumeSummaryPrompt = ai.definePrompt({
  name: "resumeSummaryPrompt",
  input: { schema: ResumeSummaryInputSchema },
  output: { schema: ResumeSummaryOutputSchema },
  prompt: `You are an AI assistant that specializes in creating professional summaries from resumes.

  Analyze the following resume and generate a concise, impactful professional summary (2-3 sentences) that highlights the candidate's key skills and experience.

  Resume File:
  {{media url=resumeFile}}

  Format your response as a JSON object with a "summary" key.
  `,
});
const resumeSummaryFlow = ai.defineFlow(
  {
    name: "resumeSummaryFlow",
    inputSchema: ResumeSummaryInputSchema,
    outputSchema: ResumeSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await resumeSummaryPrompt(input);
    return output!;
  }
);
