"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Bot,
  FileText,
  Loader2,
  Workflow,
  UploadCloud,
  X,
  ChevronRight,
  User,
  Sparkles,
  AlertCircle,
  ClipboardCopy,
  Briefcase,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { analyzeResumeAction, type AnalysisResult } from "@/app/actions";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "./ui/badge";
import { type ResumeSuggestionsOutput } from "@/ai/flows/ai-suggestion-tool";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const formSchema = z.object({
  resumeFile: z
    .instanceof(File)
    .nullable()
    .refine((file) => !!file, "A resume file is required.")
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `File size should be less than 5MB.`
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "Please upload a valid PDF or Word document."
    ),
});
const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
export function AtsOptimizerPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeFile: null,
    },
  });
  const resumeFile = form.watch("resumeFile");
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    if (!values.resumeFile) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Resume file is required.",
      });
      setIsLoading(false);
      return;
    }
    try {
      const resumeFileDataUri = await fileToDataUri(values.resumeFile);
      const result = await analyzeResumeAction(resumeFileDataUri);
      if (result.error || !result.data) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: result.error || "An unknown error occurred.",
        });
      } else {
        setAnalysisResult(result.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "File Processing Error",
        description: "Could not read the uploaded file. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste the suggestion.",
    });
  };
  const groupedSuggestions = (analysisResult?.detailedSuggestions || []).reduce(
    (acc, category) => {
      if (!acc[category.field]) {
        acc[category.field] = { field: category.field, suggestions: [] };
      }
      acc[category.field].suggestions.push(...category.suggestions);
      return acc;
    },
    {} as Record<
      string,
      { field: string; suggestions: ResumeSuggestionsOutput[0]["suggestions"] }
    >
  );
  return (
    <div className="grid md:grid-cols-12 gap-8">
      <div className="md:col-span-4 lg:col-span-4">
        <div className="sticky top-8 space-y-8">
          <Card className="bg-card border-dashed shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileText />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Upload your resume (PDF or Word) to get started. Your privacy is
                important; files are not stored.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="resumeFile"
                    render={({
                      field: { onChange, value, ...fieldProps },
                      fieldState,
                    }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Resume File</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div
                              className={cn(
                                "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-accent/50 transition-colors",
                                fieldState.error && "border-destructive"
                              )}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                  <span className="font-semibold text-primary">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PDF or DOCX (MAX. 5MB)
                                </p>
                              </div>
                              <input
                                {...fieldProps}
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept={ACCEPTED_FILE_TYPES.join(",")}
                                onChange={(e) =>
                                  onChange(e.target.files?.[0] ?? null)
                                }
                              />
                            </div>
                            {resumeFile && (
                              <div className="flex items-center justify-between p-3 border rounded-md bg-background/50">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                                  <span className="text-sm font-medium truncate">
                                    {resumeFile.name}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-6 h-6 flex-shrink-0"
                                  onClick={() => form.resetField("resumeFile")}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isLoading || !resumeFile}
                    size="lg"
                    className="w-full font-bold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Resume
                        <ChevronRight />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
          <Card className="bg-card shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Phone />
                Contact Us
              </CardTitle>
              <CardDescription>
                Have questions? Reach out to us.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a
                  href="mailto:amulyashrivastava7@gmail.com"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  amulyashrivastava7@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a
                  href="tel:+918825220463"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  +91-8825220463
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">
                  ITER SOA Campus-1, Jagmohan Nagar, Bhubaneswar, Odisha -
                  751030
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="md:col-span-8 lg:col-span-8 space-y-8">
        {isLoading && <AnalysisSkeleton />}
        {!isLoading && !analysisResult && (
          <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px] bg-card border-dashed shadow-lg border-primary/20">
            <Bot size={48} className="text-primary mb-4" />
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription className="mt-2 max-w-sm">
              Your score, a detailed breakdown, and actionable suggestions will
              appear here once you upload your resume.
            </CardDescription>
          </Card>
        )}
        {analysisResult && (
          <>
            <Card className="bg-card shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Your ATS Score</CardTitle>
                <CardDescription>
                  Based on an analysis of your resume against common ATS
                  criteria.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Progress value={analysisResult.score} className="h-4" />
                  <span className="text-2xl font-bold text-foreground">
                    {analysisResult.score}%
                  </span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Detailed Analysis
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="text-primary" />
                        Detailed Analysis
                      </DialogTitle>
                      <DialogDescription>
                        A breakdown of your resume's strengths and weaknesses.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto p-1 pr-4 no-scrollbar text-justify">
                      <p className="whitespace-pre-line">
                        {analysisResult.analysis}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <User />
                  Personal Summary
                </CardTitle>
                <CardDescription>
                  An AI-generated summary of your professional profile. Click to
                  view.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <p className="text-muted-foreground cursor-pointer hover:text-primary transition-colors line-clamp-3">
                      {analysisResult.summary}
                    </p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <User className="text-primary" />
                        AI-Generated Personal Summary
                      </DialogTitle>
                    </DialogHeader>
                    <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto no-scrollbar p-1 text-justify">
                      <p>{analysisResult.summary}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles />
                  AI Suggestions for Improvement
                </CardTitle>
                <CardDescription>
                  Implement these changes to improve your score. Click on a
                  category to see the suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.values(groupedSuggestions).map((category, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start gap-3 h-auto py-3 group"
                      >
                        <div className="bg-accent/10 p-3 rounded-md group-hover:bg-accent transition-colors">
                          <Workflow
                            size={20}
                            className="text-primary group-hover:text-accent-foreground"
                          />
                        </div>
                        <span className="font-bold text-base">
                          {category.field} Improvement
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <div className="bg-accent/10 p-3 rounded-md">
                            <Workflow size={20} className="text-primary" />
                          </div>
                          {category.field} Improvement
                        </DialogTitle>
                        <DialogDescription>
                          AI-powered suggestions to improve the '
                          {category.field}' section of your resume.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar p-1 pr-2">
                        <Accordion type="single" collapsible className="w-full">
                          {category.suggestions.map((item, itemIndex) => (
                            <AccordionItem
                              key={itemIndex}
                              value={`item-${itemIndex}`}
                            >
                              <AccordionTrigger>
                                Suggestion #{itemIndex + 1}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4">
                                  {item.originalText && (
                                    <div className="space-y-2">
                                      <h3 className="font-semibold text-muted-foreground">
                                        Original Text:
                                      </h3>
                                      <blockquote className="border-l-2 pl-6 italic text-sm text-muted-foreground text-justify">
                                        {item.originalText}
                                      </blockquote>
                                    </div>
                                  )}
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-primary">
                                      Suggested Text:
                                    </h3>
                                    <div className="flex items-start gap-2">
                                      <div className="flex-grow prose prose-sm dark:prose-invert p-4 border rounded-md bg-background/50 text-justify">
                                        <p
                                          className="whitespace-pre-line"
                                          dangerouslySetInnerHTML={{
                                            __html: item.suggestion
                                              .replace(
                                                /\*\*(.*?)\*\*/g,
                                                "<strong>$1</strong>"
                                              )
                                              .replace(/\n/g, "<br />"),
                                          }}
                                        />
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 flex-shrink-0 mt-2"
                                        onClick={() =>
                                          handleCopy(item.suggestion)
                                        }
                                      >
                                        <ClipboardCopy className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">
                                      Reason:
                                    </h3>
                                    <div className="prose prose-sm dark:prose-invert text-justify">
                                      <p>{item.reason}</p>
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-card shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Briefcase />
                  Job Suggestions
                </CardTitle>
                <CardDescription>
                  Top roles suggested by our AI based on your profile. Click one
                  for details.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {analysisResult.jobSuggestions.map((job, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="text-sm py-1 px-3 cursor-pointer hover:bg-primary/20 transition-colors"
                      >
                        {job.jobTitle}
                      </Badge>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Briefcase className="text-primary" />
                          Why you're a good fit for: {job.jobTitle}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto p-1 pr-4 no-scrollbar text-justify">
                        <p>{job.reason}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
const AnalysisSkeleton = () => (
  <>
    <Card className="bg-card shadow-lg border-primary/20">
      <CardHeader>
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </CardContent>
    </Card>
    <Card className="bg-card shadow-lg border-primary/20">
      <CardHeader>
        <Skeleton className="h-6 w-1/3 rounded-md" />
        <Skeleton className="h-4 w-2/3 mt-2 rounded-md" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </CardContent>
    </Card>
    <Card className="bg-card shadow-lg border-primary/20">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 mt-2 rounded-md" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
      </CardContent>
    </Card>
    <Card className="bg-card shadow-lg border-primary/20">
      <CardHeader>
        <Skeleton className="h-6 w-1/3 rounded-md" />
        <Skeleton className="h-4 w-2/3 mt-2 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </CardContent>
    </Card>
  </>
);
