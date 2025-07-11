"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Loader2, Sparkles, Code, Palette, Zap, Globe, Lightbulb, Rocket, Star } from "lucide-react"
import type { Message } from "@/lib/types"

interface EnhancedChatPanelProps {
  onPromptSubmit: (prompt: string) => void
  isGenerating: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  initialPrompt: string
  generationStage: string
}

const EXAMPLE_PROMPTS = [
  {
    icon: Rocket,
    title: "Landing Page",
    description: "Modern SaaS landing page",
    prompt: "Create a modern SaaS landing page with hero section, features, pricing, and testimonials",
  },
  {
    icon: Star,
    title: "Portfolio",
    description: "Personal portfolio site",
    prompt: "Build a personal portfolio website with projects showcase, about section, and contact form",
  },
  {
    icon: Globe,
    title: "Business Site",
    description: "Professional business website",
    prompt: "Design a professional business website with services, team, and contact information",
  },
  {
    icon: Lightbulb,
    title: "Blog",
    description: "Modern blog layout",
    prompt: "Create a modern blog website with article listings, categories, and responsive design",
  },
]

const GENERATION_MESSAGES = {
  analyzing: "🧠 Analyzing your requirements...",
  implementing: "⚡ Building with HTML5, CSS3 & JavaScript...",
  finalizing: "✨ Adding final touches...",
  complete: "✅ Generation complete!",
}

export function EnhancedChatPanel({
  onPromptSubmit,
  isGenerating,
  messages,
  setMessages,
  initialPrompt,
  generationStage,
}: EnhancedChatPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (initialPrompt && !hasSubmitted) {
      setPrompt(initialPrompt)
      handleSubmit(initialPrompt)
      setHasSubmitted(true)
    }
  }, [initialPrompt, hasSubmitted])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (submitPrompt?: string) => {
    const finalPrompt = submitPrompt || prompt.trim()
    if (!finalPrompt || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: finalPrompt,
      timestamp: new Date(),
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content:
        "🚀 **Starting website generation...**\n\nAnalyzing your request and preparing to build your modern website with HTML5, CSS3, TailwindCSS, and JavaScript ES6+.",
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage, loadingMessage])
    setPrompt("")

    await onPromptSubmit(finalPrompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="space-y-6">
              {/* Welcome Message */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Welcome to VibesCode.AI</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Describe the website you want to create, and I'll build it using modern web technologies:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      <Code className="w-3 h-3 mr-1" />
                      HTML5
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <Palette className="w-3 h-3 mr-1" />
                      CSS3
                    </Badge>
                    <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                      <Zap className="w-3 h-3 mr-1" />
                      TailwindCSS
                    </Badge>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      <Globe className="w-3 h-3 mr-1" />
                      JavaScript ES6+
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Example Prompts */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 px-1">Try these examples:</h4>
                <div className="grid gap-2">
                  {EXAMPLE_PROMPTS.map((example, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:bg-gray-50 transition-colors border-gray-200 hover:border-purple-300"
                      onClick={() => handleExampleClick(example.prompt)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <example.icon className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-800">{example.title}</div>
                            <div className="text-xs text-gray-500 truncate">{example.description}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 ${message.role === "user" ? "text-purple-100" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* Generation Status */}
          {isGenerating && (
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                  <div className="flex-1">
                    <div className="font-medium text-purple-800 text-sm">
                      {GENERATION_MESSAGES[generationStage as keyof typeof GENERATION_MESSAGES] || "Processing..."}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      Building your website with modern technologies...
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the website you want to create..."
              className="min-h-[80px] pr-12 resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              disabled={isGenerating}
            />
            <Button
              onClick={() => handleSubmit()}
              disabled={!prompt.trim() || isGenerating}
              size="sm"
              className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">Press Enter to send • Shift+Enter for new line</div>
        </div>
      </div>
    </div>
  )
}
