"use server";
import { analyzeResumeAtsScore } from "@/ai/flows/ats-score-analysis";
import {
  getResumeSuggestions,
  type ResumeSuggestionsOutput,
} from "@/ai/flows/ai-suggestion-tool";
import { getResumeSummary } from "@/ai/flows/resume-summary-flow";
import {
  getJobSuggestions,
  type JobSuggestionsOutput,
} from "@/ai/flows/job-suggestion-flow";
export interface AnalysisResult {
  score: number;
  analysis: string;
  summary: string;
  detailedSuggestions: ResumeSuggestionsOutput;
  jobSuggestions: JobSuggestionsOutput["jobSuggestions"];
}
export async function analyzeResumeAction(
  resumeFile: string
): Promise<{ data: AnalysisResult | null; error: string | null }> {
  if (!resumeFile) {
    return { data: null, error: "Resume file is required." };
  }
  try {
    const [atsResult, suggestionsResult, summaryResult, jobSuggestionsResult] =
      await Promise.all([
        analyzeResumeAtsScore({ resumeFile }),
        getResumeSuggestions({ resumeFile }),
        getResumeSummary({ resumeFile }),
        getJobSuggestions({ resumeFile }),
      ]);
    if (
      !atsResult ||
      !suggestionsResult ||
      !summaryResult ||
      !jobSuggestionsResult
    ) {
      throw new Error("Failed to get analysis from AI.");
    }

    return {
      data: {
        score: atsResult.score,
        analysis: atsResult.analysis,
        summary: summaryResult.summary,
        detailedSuggestions: suggestionsResult,
        jobSuggestions: jobSuggestionsResult.jobSuggestions,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return {
      data: null,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
