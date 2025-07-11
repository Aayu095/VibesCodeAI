# ✨ VibesCode.AI - Modern AI Website Builder

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/indysafe-chats-projects/v0-vibes-code-ai-roadmap)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-blue?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.io)
[![AI by Google Gemini](https://img.shields.io/badge/AI%20by-Google%20Gemini-orange?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)

**VibesCode.AI** is a cutting-edge, in-browser web development environment that leverages the power of generative AI to help you build modern, responsive websites in minutes. Simply describe what you want to create, and our AI will generate the code for you.

## 🚀 Core Features

- **AI-Powered Code Generation**: Describe your vision in plain English and watch as VibesCode.AI generates a complete, multi-file website using modern technologies.
- **In-Browser IDE**: A full-featured development environment right in your browser, including:
  - **Live Preview**: See your changes rendered in real-time.
  - **Code Editor**: A powerful Monaco-based editor for fine-tuning your code.
  - **File Explorer**: Manage your project's file structure with ease.
- **Full Project Lifecycle Management**:
  - **Templates**: Start from a variety of pre-built templates.
  - **Save & Load**: Save your projects to the cloud and continue your work anytime.
  - **Import/Export**: Easily import and export your projects as JSON files.
  - **Publishing**: Deploy your finished website directly from the app.
- **Robust & Resilient**: Built with a fallback system that ensures you always get a high-quality website, even if the AI service is temporarily unavailable.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) & [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **AI**: [Google Gemini](https://ai.google.dev/) via the [Vercel AI SDK](https://sdk.vercel.ai/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## 🏁 Getting Started Locally

To run this project on your local machine, follow these steps:

### 1. Clone the Repository

First, clone this repository to your local machine using git:

```bash
git clone https://github.com/Aayu095/VibesCodeAI.git
cd VibesCodeAI
```

### 2. Install Dependencies

This project uses `pnpm` for package management. Install the dependencies by running:

```bash
pnpm install
```

### 3. Set Up Environment Variables

You will need to set up a Supabase project and a Google Generative AI API key.

Create a `.env.local` file in the root of the project and add the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Generative AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
```

### 4. Run the Development Server

Once the dependencies are installed and the environment variables are set, you can start the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
