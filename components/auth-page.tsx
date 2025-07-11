"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Github, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react"

interface AuthPageProps {
  onBack: () => void
  onAuthSuccess: (user: any) => void
}

export function AuthPage({ onBack, onAuthSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onAuthSuccess({
        id: "1",
        email: formData.email,
        name: formData.name || formData.email.split("@")[0],
      })
    }, 1500)
  }

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true)
    // Simulate social auth
    setTimeout(() => {
      setIsLoading(false)
      onAuthSuccess({
        id: "1",
        email: `user@${provider}.com`,
        name: `${provider} User`,
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              VibesCode.AI
            </span>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{isSignUp ? "Create your account" : "Welcome back"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Start building amazing websites with AI" : "Sign in to continue building with AI"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Auth Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleSocialAuth("google")}
                disabled={isLoading}
              >
                <Mail className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleSocialAuth("github")}
                disabled={isLoading}
              >
                <Github className="w-4 h-4 mr-2" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={isSignUp}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required={isSignUp}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>

            {!isSignUp && (
              <div className="text-center">
                <button type="button" className="text-sm text-purple-600 hover:text-purple-700">
                  Forgot your password?
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
