"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"

export function SetupGuide() {
  const [copied, setCopied] = useState(false)

  const copyEnvVar = () => {
    navigator.clipboard.writeText("GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Setup Required
        </CardTitle>
        <CardDescription>Configure your Google AI API key to enable AI-powered code generation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The app is currently running in demo mode. Follow these steps to enable full AI features.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-semibold">Step 1: Get your free Google AI API key</h4>
          <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
              Visit Google AI Studio
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Step 2: Add to environment variables</h4>
          <p className="text-sm text-gray-600">
            Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root and add:
          </p>
          <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
            <code className="text-sm">GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here</code>
            <Button variant="ghost" size="sm" onClick={copyEnvVar}>
              {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Step 3: Restart your development server</h4>
          <div className="bg-gray-100 p-3 rounded-lg">
            <code className="text-sm">npm run dev</code>
          </div>
        </div>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Google AI Studio offers a generous free tier with 15 requests per minute - perfect for development!
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
