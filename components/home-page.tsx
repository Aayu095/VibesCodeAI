"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Sparkles,
  Zap,
  Code,
  Palette,
  Rocket,
  Globe,
  Play,
  Clock,
  CheckCircle,
  Github,
  Twitter,
  Mail,
  Heart,
  Shield,
} from "lucide-react"

interface HomePageProps {
  onStartBuilding: (prompt: string) => void
  onSignInClick?: () => void
}

const INSPIRATION_PROMPTS = [
  "Modern portfolio with dark theme and animations",
  "SaaS landing page with pricing tiers",
  "E-commerce store with product catalog",
  "Creative agency showcase website",
  "Restaurant menu with online ordering",
  "Blog platform with clean typography",
  "Startup landing with hero section",
  "Photography portfolio gallery",
  "Real estate listings website",
  "Fitness gym membership site",
]

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI-Powered Generation",
    description: "Transform your ideas into fully functional websites using advanced AI technology.",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Live Code Editor",
    description: "Edit your generated code with a professional VS Code-like editor with syntax highlighting.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Instant Preview",
    description: "See your website come to life in real-time with our live preview feature.",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "One-Click Deploy",
    description: "Deploy your website instantly to the web with a single click.",
  },
]

const TECH_STACK = [
  { name: "HTML5", icon: <Code className="w-5 h-5" />, color: "text-orange-500" },
  { name: "CSS3", icon: <Palette className="w-5 h-5" />, color: "text-blue-500" },
  { name: "JavaScript", icon: <Zap className="w-5 h-5" />, color: "text-yellow-500" },
  { name: "TailwindCSS", icon: <Sparkles className="w-5 h-5" />, color: "text-cyan-500" },
]

export function HomePage({ onStartBuilding, onSignInClick }: HomePageProps) {
  const [prompt, setPrompt] = useState("")
  const [currentInspiration, setCurrentInspiration] = useState(0)

  // Rotate inspiration prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInspiration((prev) => (prev + 1) % INSPIRATION_PROMPTS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = () => {
    if (prompt.trim()) {
      onStartBuilding(prompt.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-blue-400 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-500 rounded-full animate-float animation-delay-3000"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                VibesCode.AI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Examples
              </Button>
              <Button variant="ghost" size="sm">
                Documentation
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600" onClick={onSignInClick}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-badge-glow">
            <Sparkles className="w-4 h-4 animate-sparkle" />
            <span className="animate-text-shimmer bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent bg-size-200 bg-pos-0">
              AI-Powered Website Builder
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
            Build websites with{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              just a prompt
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Transform your ideas into beautiful, functional websites using AI. No coding required – just describe what
            you want and watch it come to life.
          </p>

          {/* Main Prompt Input */}
          <div className="max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-400">
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website you want to build... (e.g., 'Create a modern portfolio website with dark theme and smooth animations')"
                className="min-h-[120px] text-lg p-6 border-2 border-gray-200 focus:border-purple-400 rounded-2xl resize-none shadow-lg backdrop-blur-sm bg-white/90"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSubmit()
                  } else if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="text-sm text-gray-400">Enter or ⌘ + Enter</span>
                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl transition-all"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Generate Website
                </Button>
              </div>
            </div>
          </div>

          {/* Inspiration Prompts - Floating Display */}
          <div className="mb-12 animate-fade-in-up animation-delay-600">
            <p className="text-sm text-gray-500 mb-4">💡 Need inspiration? Try:</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {INSPIRATION_PROMPTS.slice(0, 6).map((inspiration, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(inspiration)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 hover:scale-105 ${
                    index === currentInspiration % 6
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-700 shadow-md animate-pulse-soft"
                      : "bg-white/80 border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
                  }`}
                >
                  {inspiration}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-16 animate-fade-in-up animation-delay-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Generate in seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-500" />
              <span>Full code access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">Built with modern technologies</p>
          <div className="flex items-center justify-center gap-8">
            {TECH_STACK.map((tech, index) => (
              <div key={index} className="flex items-center gap-2 text-sm font-medium">
                <div className={`${tech.color}`}>{tech.icon}</div>
                <span className="text-gray-700">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/80 backdrop-blur-sm py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need to build amazing websites</h2>
            <p className="text-gray-600 text-lg">Powerful features that make web development effortless</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {FEATURES.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to build your dream website?</h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are building amazing websites with AI. Start for free today.
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
            onClick={() => {
              const element = document.querySelector("textarea")
              element?.focus()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Building Now
          </Button>
        </div>
      </section>

      {/* Comprehensive Footer - Lovable Style */}
      <footer className="bg-gray-900 text-white relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VibesCode.AI</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Build modern, responsive websites with AI-powered technology. Transform your ideas into beautiful,
                functional websites in seconds. No coding required.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Examples
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Lightning Fast</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>© 2024 VibesCode.AI. Built with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>for creators</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes badge-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.5);
            transform: scale(1.05);
          }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.2); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.2); }
        }
        
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-badge-glow {
          animation: badge-glow 3s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .animate-text-shimmer {
          animation: text-shimmer 3s ease-in-out infinite;
          background-size: 200% 100%;
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
        
        .bg-size-200 {
          background-size: 200% 100%;
        }
        
        .bg-pos-0 {
          background-position: 0% 50%;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        .animation-delay-800 {
          animation-delay: 800ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        .animation-delay-3000 {
          animation-delay: 3000ms;
        }
        
        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
      `}</style>
    </div>
  )
}
