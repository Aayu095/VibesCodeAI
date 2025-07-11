"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink, CheckCircle, Database, Key, Settings } from "lucide-react"

export function SupabaseSetupGuide() {
  const [copied, setCopied] = useState("")

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(""), 2000)
  }

  const sqlSchema = `-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  files JSONB NOT NULL DEFAULT '[]',
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  template_category TEXT,
  template_tags TEXT[] DEFAULT '{}',
  template_difficulty TEXT CHECK (template_difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  downloads_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create project policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public projects" ON public.projects
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);`

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🆓 Free Supabase Setup Guide</h1>
        <p className="text-gray-600">Set up your free Supabase database in minutes</p>
      </div>

      {/* Step 1: Create Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            Step 1: Create Free Supabase Account
          </CardTitle>
          <CardDescription>Sign up for a completely free Supabase account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Free Tier Includes:</strong> 500MB Database, 50K API requests/month, 1GB Storage, Unlimited Auth
              users
            </AlertDescription>
          </Alert>

          <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
              Create Free Account at Supabase.com
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Step 2: Create Project */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Step 2: Create New Project
          </CardTitle>
          <CardDescription>Set up your database project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">1. Click "New Project" in your Supabase dashboard</p>
            <p className="text-sm font-medium">2. Choose any name (e.g., "vibescode-ai")</p>
            <p className="text-sm font-medium">3. Create a strong database password</p>
            <p className="text-sm font-medium">4. Select the closest region to you</p>
            <p className="text-sm font-medium">5. Click "Create new project"</p>
          </div>

          <Alert>
            <AlertDescription>
              ⏱️ Project creation takes 1-2 minutes. You'll get a confirmation email when ready.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Step 3: Get API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-600" />
            Step 3: Get Your API Keys
          </CardTitle>
          <CardDescription>Copy your project credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">1. Go to Project Settings → API</p>
            <p className="text-sm font-medium">2. Copy the following values:</p>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Project URL</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("NEXT_PUBLIC_SUPABASE_URL=your-project-url-here", "url")}
                >
                  {copied === "url" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL=your-project-url-here</code>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Anon Public Key</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here", "anon")}
                >
                  {copied === "anon" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here</code>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Service Role Key</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here", "service")}
                >
                  {copied === "service" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Set up Database */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-600" />
            Step 4: Set Up Database Schema
          </CardTitle>
          <CardDescription>Run SQL commands to create your tables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">1. Go to SQL Editor in your Supabase dashboard</p>
            <p className="text-sm font-medium">2. Copy and paste this SQL schema:</p>
          </div>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => copyToClipboard(sqlSchema, "sql")}
            >
              {copied === "sql" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
            <pre className="text-xs overflow-x-auto pr-12">
              <code>{sqlSchema}</code>
            </pre>
          </div>

          <p className="text-sm text-gray-600">3. Click "Run" to execute the SQL commands</p>
        </CardContent>
      </Card>

      {/* Step 5: Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Step 5: Add Environment Variables
          </CardTitle>
          <CardDescription>Configure your Next.js app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              1. Create a <code>.env.local</code> file in your project root
            </p>
            <p className="text-sm font-medium">2. Add your Supabase credentials:</p>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Environment Variables</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    `NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key`,
                    "env",
                  )
                }
              >
                {copied === "env" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <pre className="text-xs">
              {`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key`}
            </pre>
          </div>

          <p className="text-sm text-gray-600">3. Replace the placeholder values with your actual keys</p>
          <p className="text-sm text-gray-600">
            4. Restart your development server: <code>npm run dev</code>
          </p>
        </CardContent>
      </Card>

      {/* Success */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>🎉 You're all set!</strong> Your app now has a free, production-ready PostgreSQL database with
          authentication, real-time features, and more!
        </AlertDescription>
      </Alert>
    </div>
  )
}
