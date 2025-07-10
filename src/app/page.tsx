import { AtsOptimizerPage } from "@/components/ats-optimizer-page";
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            ATS Resume Optimizer
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
            Upload your resume to get an instant ATS score, detailed analysis,
            and AI-powered suggestions to land your dream job.
          </p>
        </header>
        <AtsOptimizerPage />
      </div>
    </main>
  );
}
