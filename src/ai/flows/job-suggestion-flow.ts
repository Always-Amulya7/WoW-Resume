"use server";
/**
 * @fileOverview This file implements an AI tool for suggesting jobs based on a resume.
 *
 * - getJobSuggestions - A function that takes resume file data and returns job suggestions with reasons.
 * - JobSuggestionsInput - The input type for the getJobSuggestions function.
 * - JobSuggestionsOutput - The return type for the getJobSuggestions function.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
const JobSuggestionsInputSchema = z.object({
  resumeFile: z
    .string()
    .describe(
      "The resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type JobSuggestionsInput = z.infer<typeof JobSuggestionsInputSchema>;
const JobSuggestionItemSchema = z.object({
  jobTitle: z
    .string()
    .describe(
      "A specific job title that would be a good fit for the candidate."
    ),
  reason: z
    .string()
    .describe(
      "A detailed explanation of why the candidate is a good fit for this job, based on their skills and experience from the resume."
    ),
});
const JobSuggestionsOutputSchema = z.object({
  jobSuggestions: z
    .array(JobSuggestionItemSchema)
    .describe(
      "A list of 3-5 job suggestions, each with a title and a reason for the fit."
    ),
});
export type JobSuggestionsOutput = z.infer<typeof JobSuggestionsOutputSchema>;
export async function getJobSuggestions(
  input: JobSuggestionsInput
): Promise<JobSuggestionsOutput> {
  return jobSuggestionsFlow(input);
}
const jobSuggestionsPrompt = ai.definePrompt({
  name: "jobSuggestionsPrompt",
  input: { schema: JobSuggestionsInputSchema },
  output: { schema: JobSuggestionsOutputSchema },
  prompt: `You are an expert career counselor and recruitment specialist.

  Analyze the following resume and identify 3-5 specific job titles that would be an excellent fit for the candidate's skills and experience.
  For each job title, provide a detailed reason explaining why the candidate is a good fit, referencing specific skills or experiences from their resume.

  Resume File:
  {{media url=resumeFile}}

  Format your response as a JSON object with a "jobSuggestions" key containing an array of objects, where each object has a "jobTitle" and a "reason".
  `,
});
const jobSuggestionsFlow = ai.defineFlow(
  {
    name: "jobSuggestionsFlow",
    inputSchema: JobSuggestionsInputSchema,
    outputSchema: JobSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await jobSuggestionsPrompt(input);
    return output!;
  }
);
