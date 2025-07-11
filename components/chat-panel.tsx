"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, User, Bot, Sparkles } from "lucide-react"
import type { Message } from "@/lib/types"

interface ChatPanelProps {
  onPromptSubmit: (prompt: string) => void
  isGenerating: boolean
  messages: Message[]
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void
  initialPrompt?: string
}

const EXAMPLE_PROMPTS = [
  "Add a contact form to the website",
  "Change the color scheme to blue and green",
  "Add a navigation menu with smooth scrolling",
  "Include a testimonials section",
  "Make the design more modern and minimal",
]

export function ChatPanel({ onPromptSubmit, isGenerating, messages, setMessages, initialPrompt }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [hasProcessedInitial, setHasProcessedInitial] = useState(false)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Process initial prompt
  useEffect(() => {
    if (initialPrompt && !hasProcessedInitial) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: initialPrompt,
        timestamp: new Date(),
      }

      const loadingMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "🎨 Generating your website... This might take a moment!",
        timestamp: new Date(),
      }

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "👋 Welcome to VibesCode.AI! I'm generating your website based on your prompt.",
          timestamp: new Date(),
        },
        userMessage,
        loadingMessage,
      ])

      setHasProcessedInitial(true)
    }
  }, [initialPrompt, hasProcessedInitial, setMessages])

  const handleSubmit = (prompt: string) => {
    if (!prompt.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    onPromptSubmit(prompt)

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "🎨 Updating your website... This might take a moment!",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, loadingMessage])
  }

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">{message.timestamp.toLocaleTimeString()}</span>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Example Prompts */}
      {messages.length <= 3 && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Try these suggestions:</p>
          <div className="space-y-2">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(prompt)}
                className="w-full text-left p-2 text-sm bg-white border rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 inline mr-2 text-purple-500" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe changes you want to make..."
            className="resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(input)
              }
            }}
          />
          <Button
            onClick={() => handleSubmit(input)}
            disabled={!input.trim() || isGenerating}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 self-end"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
