# 🎯 WoW Resume - ATS Resume Optimizer

<div align="center">

Next.js, TypeScript, TailWind CSS, Google Gemini AI

**Boost your resume's ATS score and land your dream job with AI-powered optimization**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

**WoW Resume** is an intelligent ATS (Applicant Tracking System) resume optimizer that leverages the power of Google's Gemini 2.0 Flash AI model to help job seekers improve their resumes. The application analyzes your resume, provides an ATS compatibility score, offers detailed suggestions for improvement, and even suggests suitable job positions based on your skills and experience.

### Why WoW Resume?

- **Instant Analysis**: Get your ATS score in seconds
- **AI-Powered Insights**: Receive intelligent suggestions to improve your resume
- **Job Matching**: Discover job positions that align with your skills
- **Professional Summaries**: Generate compelling professional summaries
- **User-Friendly Interface**: Clean, modern dark-themed UI

---

## ✨ Features

### 🔍 ATS Score Analysis
- Upload your resume (PDF or Word format)
- Get a comprehensive ATS compatibility score (0-100)
- Receive detailed analysis of strengths and weaknesses
- Strict grading system simulating competitive job markets

### 💡 AI-Powered Suggestions
- Receive specific, actionable improvement suggestions
- Categorized by resume sections (Skills, Experience, Education, etc.)
- Original text highlighting with recommended replacements
- Clear reasoning for each suggestion

### 🎯 Job Suggestions
- Get 3-5 personalized job title recommendations
- Detailed explanations of why each role fits your profile
- Based on your skills and experience analysis

### 📝 Resume Summary Generation
- AI-generated professional summaries
- Concise, impactful 2-3 sentence overviews
- Highlights key skills and experience

### 🎨 Modern UI/UX
- Dark theme for comfortable viewing
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive file upload interface

---

## 🚀 Demo

### How It Works

1. **Upload Your Resume**: Drag and drop or click to upload your PDF/Word document (max 5MB)
2. **AI Analysis**: Our AI powered by Google Gemini analyzes your resume
3. **Get Results**: View your ATS score, detailed analysis, and suggestions
4. **Improve**: Apply the suggestions to boost your resume's effectiveness

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.8** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui** - Re-usable UI components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Recharts** - Composable charting library
- **React Hook Form** - Form state management
- **Zod** - TypeScript-first schema validation

### Backend & AI
- **Genkit 1.13.0** - AI application framework
- **Google Gemini 2.0 Flash** - AI model for analysis
- **Next.js Server Actions** - Server-side logic

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development

---

## 📁 Project Structure

```
wow-resume/
├── src/
│   ├── ai/                          # AI-related code
│   │   ├── flows/                   # AI flow definitions
│   │   │   ├── ai-suggestion-tool.ts    # Resume improvement suggestions
│   │   │   ├── ats-score-analysis.ts    # ATS score calculation
│   │   │   ├── job-suggestion-flow.ts   # Job recommendations
│   │   │   └── resume-summary-flow.ts   # Summary generation
│   │   ├── dev.ts                   # Development server setup
│   │   └── genkit.ts                # Genkit configuration
│   ├── app/                         # Next.js App Router
│   │   ├── actions.ts               # Server actions
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/                  # React components
│   │   ├── ui/                      # UI components (shadcn/ui)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (30+ components)
│   │   └── ats-optimizer-page.tsx   # Main application component
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── lib/                         # Utility functions
│       └── utils.ts
├── public/                          # Static assets
├── package.json                     # Dependencies
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── next.config.ts                   # Next.js configuration
└── README.md                        # This file
```

---

## ⚙️ Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **Google AI API Key** (for Gemini access)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wow-resume.git
   cd wow-resume
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your environment variables** (see [Environment Setup](#-environment-setup))

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

---

## 🔐 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Google AI API Key (required)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Optional: Firebase configuration (if using Firebase features)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Getting a Google AI API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and add it to your `.env.local` file

---

## 📖 Usage

### Development Mode

```bash
# Start the Next.js development server
npm run dev

# Start the Genkit AI development server (in a separate terminal)
npm run genkit:dev

# Start Genkit with watch mode
npm run genkit:watch
```

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Other Commands

```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck
```

---

## 📚 API Documentation

### Server Actions

#### `analyzeResumeAction(resumeFile: string)`

Analyzes a resume and returns comprehensive results.

**Parameters:**
- `resumeFile` (string): Base64-encoded data URI of the resume file

**Returns:**
```typescript
{
  data: {
    score: number;              // ATS score (0-100)
    analysis: string;           // Detailed analysis text
    summary: string;            // Professional summary
    detailedSuggestions: Array<{
      field: string;            // Resume section
      suggestions: Array<{
        originalText?: string;  // Original text to replace
        suggestion: string;     // Recommended improvement
        reason: string;         // Why this improves the resume
      }>
    }>;
    jobSuggestions: Array<{
      jobTitle: string;         // Recommended job title
      reason: string;           // Why this role fits
    }>;
  };
  error: string | null;
}
```

### AI Flows

1. **ATS Score Analysis** (`ats-score-analysis.ts`)
   - Analyzes resume for ATS compatibility
   - Returns score, analysis, and suggestions

2. **Resume Suggestions** (`ai-suggestion-tool.ts`)
   - Provides detailed improvement suggestions
   - Categorized by resume sections

3. **Job Suggestions** (`job-suggestion-flow.ts`)
   - Recommends suitable job positions
   - Based on skills and experience

4. **Resume Summary** (`resume-summary-flow.ts`)
   - Generates professional summary
   - Highlights key qualifications

---

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of [Radix UI](https://www.radix-ui.com/). Key components include:

- **Accordion** - Collapsible content sections
- **Alert Dialog** - Modal confirmations
- **Button** - Various button styles
- **Card** - Content containers
- **Dialog** - Modal windows
- **Form** - Form components with validation
- **Progress** - Progress indicators
- **Toast** - Notification system
- **Tooltip** - Hover information

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all linting passes

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Project Link**: [https://github.com/yourusername/wow-resume](https://github.com/yourusername/wow-resume)

**Issues**: [https://github.com/yourusername/wow-resume/issues](https://github.com/yourusername/wow-resume/issues)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Google AI](https://ai.google.dev/) - AI model powering the analysis
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Genkit](https://genkit.dev/) - AI application framework
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives

---

<div align="center">

**Made with ❤️ for job seekers everywhere**

⭐ Star this repo if you found it helpful!

</div>
