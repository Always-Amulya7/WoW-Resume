"use server";
/**
 * @fileOverview An ATS score analysis AI agent.
 *
 * - analyzeResumeAtsScore - A function that handles the resume analysis process.
 * - AnalyzeResumeAtsScoreInput - The input type for the analyzeResumeAtsScore function.
 * - AnalyzeResumeAtsScoreOutput - The return type for the analyzeResumeAtsScore function.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
const AnalyzeResumeAtsScoreInputSchema = z.object({
  resumeFile: z
    .string()
    .describe(
      "The resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeResumeAtsScoreInput = z.infer<
  typeof AnalyzeResumeAtsScoreInputSchema
>;
const AnalyzeResumeAtsScoreOutputSchema = z.object({
  score: z.number().describe("The ATS score of the resume (0-100)."),
  analysis: z
    .string()
    .describe(
      "The analysis of the resume, including strengths and weaknesses. Format this as a clean, readable text block without any markdown."
    ),
  suggestions: z
    .array(z.string())
    .describe("Suggestions for improving the resume score."),
});
export type AnalyzeResumeAtsScoreOutput = z.infer<
  typeof AnalyzeResumeAtsScoreOutputSchema
>;
export async function analyzeResumeAtsScore(
  input: AnalyzeResumeAtsScoreInput
): Promise<AnalyzeResumeAtsScoreOutput> {
  return analyzeResumeAtsScoreFlow(input);
}
const prompt = ai.definePrompt({
  name: "analyzeResumeAtsScorePrompt",
  input: { schema: AnalyzeResumeAtsScoreInputSchema },
  output: { schema: AnalyzeResumeAtsScoreOutputSchema },
  prompt: `You are an expert in Applicant Tracking Systems (ATS) and a very strict resume grader. Your standards are high because you are simulating a highly competitive job market.

  Analyze the following resume and provide a critical ATS score (0-100). A score of 85 or higher should be rare and reserved for truly exceptional, perfectly optimized resumes. Be a tough grader.

  Also provide an analysis of the resume's strengths and weaknesses, and suggestions for improvement.

  Resume: {{media url=resumeFile}}

  Format your response as a JSON object with the following keys:
  - score: The ATS score of the resume (0-100). Be critical and strict.
  - analysis: The analysis of the resume, including strengths and weaknesses. Present this as a clean, readable text block, without any markdown characters like asterisks or quotes. Start with a summary, then list strengths and weaknesses clearly.
  - suggestions: Suggestions for improving the resume score.`,
});
const analyzeResumeAtsScoreFlow = ai.defineFlow(
  {
    name: "analyzeResumeAtsScoreFlow",
    inputSchema: AnalyzeResumeAtsScoreInputSchema,
    outputSchema: AnalyzeResumeAtsScoreOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (output) {
      output.analysis = output.analysis.replace(/[\*"]/g, "").trim();
    }
    return output!;
  }
);
