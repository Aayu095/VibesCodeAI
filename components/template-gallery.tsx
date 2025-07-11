"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, ShoppingCart, Briefcase, Search, Eye, Download, Star } from "lucide-react"
import type { FileNode } from "@/app/page"

interface Template {
  id: string
  name: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tags: string[]
  preview: string
  files: FileNode[]
  downloads: number
  rating: number
  icon: React.ReactNode
}

const TEMPLATES: Template[] = [
  {
    id: "modern-portfolio",
    name: "Modern Portfolio",
    description: "A sleek, dark-themed portfolio website with smooth animations and modern design",
    category: "Portfolio",
    difficulty: "Intermediate",
    tags: ["dark-theme", "animations", "responsive", "modern"],
    preview: "/placeholder.svg?height=200&width=300",
    downloads: 1247,
    rating: 4.8,
    icon: <Users className="w-5 h-5" />,
    files: [
      {
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>John Doe - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-400 { animation-delay: 0.4s; }
    </style>
</head>
<body class="bg-gray-900 text-white">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-gray-900/90 backdrop-blur-sm z-50 border-b border-gray-800">
        <div class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    John Doe
                </h1>
                <div class="hidden md:flex space-x-8">
                    <a href="#home" class="hover:text-purple-400 transition-colors">Home</a>
                    <a href="#about" class="hover:text-purple-400 transition-colors">About</a>
                    <a href="#projects" class="hover:text-purple-400 transition-colors">Projects</a>
                    <a href="#contact" class="hover:text-purple-400 transition-colors">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="min-h-screen flex items-center justify-center px-6">
        <div class="text-center max-w-4xl mx-auto">
            <div class="animate-fadeInUp">
                <h2 class="text-6xl md:text-8xl font-bold mb-6">
                    Creative
                    <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                        Developer
                    </span>
                </h2>
            </div>
            <p class="text-xl md:text-2xl text-gray-300 mb-8 animate-fadeInUp animate-delay-200">
                I craft beautiful digital experiences with modern web technologies
            </p>
            <div class="animate-fadeInUp animate-delay-400">
                <button class="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                    View My Work
                </button>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 px-6">
        <div class="container mx-auto max-w-4xl">
            <h3 class="text-4xl font-bold mb-12 text-center">About Me</h3>
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <p class="text-lg text-gray-300 mb-6">
                        I'm a passionate full-stack developer with 5+ years of experience creating 
                        digital solutions that make a difference. I specialize in React, Node.js, 
                        and modern web technologies.
                    </p>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-800 p-4 rounded-lg">
                            <h4 class="font-semibold text-purple-400">Frontend</h4>
                            <p class="text-sm text-gray-300">React, Vue, TypeScript</p>
                        </div>
                        <div class="bg-gray-800 p-4 rounded-lg">
                            <h4 class="font-semibold text-purple-400">Backend</h4>
                            <p class="text-sm text-gray-300">Node.js, Python, PostgreSQL</p>
                        </div>
                    </div>
                </div>
                <div class="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-8 rounded-2xl">
                    <div class="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4"></div>
                    <h4 class="text-center text-xl font-semibold">John Doe</h4>
                    <p class="text-center text-gray-300">Full Stack Developer</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-20 px-6 bg-gray-800/50">
        <div class="container mx-auto max-w-6xl">
            <h3 class="text-4xl font-bold mb-12 text-center">Featured Projects</h3>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all">
                    <div class="h-48 bg-gradient-to-br from-purple-500 to-pink-500"></div>
                    <div class="p-6">
                        <h4 class="text-xl font-semibold mb-2">E-commerce Platform</h4>
                        <p class="text-gray-300 mb-4">Modern e-commerce solution with React and Node.js</p>
                        <div class="flex gap-2">
                            <span class="text-xs bg-purple-600 px-2 py-1 rounded">React</span>
                            <span class="text-xs bg-pink-600 px-2 py-1 rounded">Node.js</span>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all">
                    <div class="h-48 bg-gradient-to-br from-blue-500 to-cyan-500"></div>
                    <div class="p-6">
                        <h4 class="text-xl font-semibold mb-2">Task Management App</h4>
                        <p class="text-gray-300 mb-4">Collaborative task management with real-time updates</p>
                        <div class="flex gap-2">
                            <span class="text-xs bg-blue-600 px-2 py-1 rounded">Vue.js</span>
                            <span class="text-xs bg-cyan-600 px-2 py-1 rounded">Socket.io</span>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all">
                    <div class="h-48 bg-gradient-to-br from-green-500 to-emerald-500"></div>
                    <div class="p-6">
                        <h4 class="text-xl font-semibold mb-2">Analytics Dashboard</h4>
                        <p class="text-gray-300 mb-4">Real-time analytics dashboard with beautiful charts</p>
                        <div class="flex gap-2">
                            <span class="text-xs bg-green-600 px-2 py-1 rounded">React</span>
                            <span class="text-xs bg-emerald-600 px-2 py-1 rounded">D3.js</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 px-6">
        <div class="container mx-auto max-w-4xl text-center">
            <h3 class="text-4xl font-bold mb-8">Let's Work Together</h3>
            <p class="text-xl text-gray-300 mb-12">
                Have a project in mind? I'd love to hear about it.
            </p>
            <div class="flex justify-center gap-6">
                <button class="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all">
                    Get In Touch
                </button>
                <button class="border border-gray-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all">
                    Download CV
                </button>
            </div>
        </div>
    </section>

    <footer class="py-8 px-6 border-t border-gray-800">
        <div class="container mx-auto text-center text-gray-400">
            <p>&copy; 2024 John Doe. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`,
      },
    ],
  },
  {
    id: "startup-landing",
    name: "SaaS Landing Page",
    description: "Professional SaaS landing page with pricing, features, and testimonials",
    category: "Business",
    difficulty: "Beginner",
    tags: ["saas", "landing-page", "pricing", "testimonials"],
    preview: "/placeholder.svg?height=200&width=300",
    downloads: 892,
    rating: 4.6,
    icon: <Briefcase className="w-5 h-5" />,
    files: [
      {
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CloudSync - SaaS Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
        <div class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                    <span class="text-xl font-bold text-gray-800">CloudSync</span>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#features" class="text-gray-600 hover:text-gray-900">Features</a>
                    <a href="#pricing" class="text-gray-600 hover:text-gray-900">Pricing</a>
                    <a href="#about" class="text-gray-600 hover:text-gray-900">About</a>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 px-6">
        <div class="container mx-auto max-w-6xl text-center">
            <h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Sync Your Team,
                <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Scale Your Business
                </span>
            </h1>
            <p class="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                CloudSync helps teams collaborate seamlessly with real-time synchronization, 
                powerful integrations, and enterprise-grade security.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700">
                    Start Free Trial
                </button>
                <button class="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50">
                    Watch Demo
                </button>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 px-6 bg-gray-50">
        <div class="container mx-auto max-w-6xl">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
                <p class="text-xl text-gray-600">Powerful features designed for modern teams</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-white p-8 rounded-xl shadow-sm">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Real-time Sync</h3>
                    <p class="text-gray-600">Keep your team in sync with instant updates across all devices and platforms.</p>
                </div>
                <div class="bg-white p-8 rounded-xl shadow-sm">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
                    <p class="text-gray-600">Bank-level security with end-to-end encryption and compliance certifications.</p>
                </div>
                <div class="bg-white p-8 rounded-xl shadow-sm">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                    <p class="text-gray-600">Built-in chat, video calls, and project management tools for seamless teamwork.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 px-6">
        <div class="container mx-auto max-w-6xl">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
                <p class="text-xl text-gray-600">Choose the plan that's right for your team</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-white border border-gray-200 rounded-xl p-8">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
                    <div class="mb-4">
                        <span class="text-4xl font-bold text-gray-900">$9</span>
                        <span class="text-gray-600">/month</span>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-gray-600">Up to 5 team members</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-gray-600">10GB storage</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-gray-600">Basic integrations</span>
                        </li>
                    </ul>
                    <button class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50">
                        Get Started
                    </button>
                </div>
                <div class="bg-blue-600 text-white rounded-xl p-8 relative">
                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span class="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Most Popular
                        </span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Professional</h3>
                    <div class="mb-4">
                        <span class="text-4xl font-bold">$29</span>
                        <span class="text-blue-200">/month</span>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-blue-100">Up to 25 team members</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-blue-100">100GB storage</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-blue-100">Advanced integrations</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-blue-100">Priority support</span>
                        </li>
                    </ul>
                    <button class="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-50">
                        Get Started
                    </button>
                </div>
                <div class="bg-white border border-gray-200 rounded-xl p-8">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                    <div class="mb-4">
                        <span class="text-4xl font-bold text-gray-900">$99</span>
                        <span class="text-gray-600">/month</span>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-gray-600">Unlimited team members</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-gray-600">Unlimited storage</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-gray-600">Custom integrations</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span class="text-gray-600">24/7 dedicated support</span>
                        </li>
                    </ul>
                    <button class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="container mx-auto max-w-4xl text-center">
            <h2 class="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p class="text-xl text-blue-100 mb-8">
                Join thousands of teams already using CloudSync to scale their business.
            </p>
            <button class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100">
                Start Your Free Trial
            </button>
        </div>
    </section>

    <footer class="py-12 px-6 bg-gray-900 text-white">
        <div class="container mx-auto max-w-6xl">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                        <span class="text-xl font-bold">CloudSync</span>
                    </div>
                    <p class="text-gray-400">
                        Sync your team, scale your business with the most powerful collaboration platform.
                    </p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Product</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Features</a></li>
                        <li><a href="#" class="hover:text-white">Pricing</a></li>
                        <li><a href="#" class="hover:text-white">Security</a></li>
                        <li><a href="#" class="hover:text-white">Integrations</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Company</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">About</a></li>
                        <li><a href="#" class="hover:text-white">Blog</a></li>
                        <li><a href="#" class="hover:text-white">Careers</a></li>
                        <li><a href="#" class="hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Support</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Help Center</a></li>
                        <li><a href="#" class="hover:text-white">Documentation</a></li>
                        <li><a href="#" class="hover:text-white">API Reference</a></li>
                        <li><a href="#" class="hover:text-white">Status</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                <p>&copy; 2024 CloudSync. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`,
      },
    ],
  },
  {
    id: "ecommerce-store",
    name: "E-commerce Store",
    description: "Modern online store with product grid, cart, and checkout functionality",
    category: "E-commerce",
    difficulty: "Advanced",
    tags: ["ecommerce", "shopping-cart", "products", "checkout"],
    preview: "/placeholder.svg?height=200&width=300",
    downloads: 654,
    rating: 4.7,
    icon: <ShoppingCart className="w-5 h-5" />,
    files: [
      {
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechStore - Premium Electronics</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b sticky top-0 z-50">
        <div class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"></div>
                    <span class="text-xl font-bold text-gray-800">TechStore</span>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#" class="text-gray-600 hover:text-gray-900">Products</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Categories</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Contact</a>
                    <div class="flex items-center gap-4">
                        <button class="relative">
                            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.32a1 1 0 00.95 1.32h9.46a1 1 0 00.95-1.32L15 13H7z"/>
                            </svg>
                            <span class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                        </button>
                        <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div class="container mx-auto px-6 text-center">
            <h1 class="text-5xl md:text-6xl font-bold mb-6">
                Premium Electronics
                <span class="block text-indigo-200">at Unbeatable Prices</span>
            </h1>
            <p class="text-xl mb-8 max-w-2xl mx-auto">
                Discover the latest in technology with our curated collection of premium electronics, 
                from smartphones to smart home devices.
            </p>
            <button class="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100">
                Shop Now
            </button>
        </div>
    </section>

    <!-- Categories -->
    <section class="py-16 px-6">
        <div class="container mx-auto max-w-6xl">
            <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">Shop by Category</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 text-center">Smartphones</h3>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 text-center">Laptops</h3>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 text-center">Audio</h3>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 text-center">Accessories</h3>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 px-6 bg-white">
        <div class="container mx-auto max-w-6xl">
            <div class="flex justify-between items-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900">Featured Products</h2>
                <button class="text-indigo-600 hover:text-indigo-700 font-semibold">View All →</button>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span class="text-gray-500 text-lg">Product Image</span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">iPhone 15 Pro</h3>
                        <p class="text-gray-600 mb-4">Latest iPhone with titanium design and advanced camera system</p>
                        <div class="flex justify-between items-center">
                            <span class="text-2xl font-bold text-gray-900">$999</span>
                            <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span class="text-gray-500 text-lg">Product Image</span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">MacBook Pro M3</h3>
                        <p class="text-gray-600 mb-4">Powerful laptop with M3 chip for professional workflows</p>
                        <div class="flex justify-between items-center">
                            <span class="text-2xl font-bold text-gray-900">$1,599</span>
                            <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span class="text-gray-500 text-lg">Product Image</span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">AirPods Pro</h3>
                        <p class="text-gray-600 mb-4">Premium wireless earbuds with active noise cancellation</p>
                        <div class="flex justify-between items-center">
                            <span class="text-2xl font-bold text-gray-900">$249</span>
                            <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Newsletter -->
    <section class="py-16 px-6 bg-gray-900 text-white">
        <div class="container mx-auto max-w-4xl text-center">
            <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
            <p class="text-gray-300 mb-8">Get the latest deals and product launches delivered to your inbox</p>
            <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    class="flex-1 px-4 py-3 rounded-lg text-gray-900"
                />
                <button class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
                    Subscribe
                </button>
            </div>
        </div>
    </section>

    <footer class="py-12 px-6 bg-gray-900 text-white border-t border-gray-800">
        <div class="container mx-auto max-w-6xl">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"></div>
                        <span class="text-xl font-bold">TechStore</span>
                    </div>
                    <p class="text-gray-400">
                        Your trusted destination for premium electronics and cutting-edge technology.
                    </p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Shop</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Smartphones</a></li>
                        <li><a href="#" class="hover:text-white">Laptops</a></li>
                        <li><a href="#" class="hover:text-white">Audio</a></li>
                        <li><a href="#" class="hover:text-white">Accessories</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Support</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Help Center</a></li>
                        <li><a href="#" class="hover:text-white">Returns</a></li>
                        <li><a href="#" class="hover:text-white">Shipping</a></li>
                        <li><a href="#" class="hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Company</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">About</a></li>
                        <li><a href="#" class="hover:text-white">Careers</a></li>
                        <li><a href="#" class="hover:text-white">Press</a></li>
                        <li><a href="#" class="hover:text-white">Blog</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                <p>&copy; 2024 TechStore. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`,
      },
    ],
  },
]

interface TemplateGalleryProps {
  onTemplateSelect: (template: Template) => void
  onClose: () => void
}

export function TemplateGallery({ onTemplateSelect, onClose }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const categories = ["All", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))]

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (template: Template) => {
    onTemplateSelect(template)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
            <p className="text-gray-600">Choose from our collection of professional website templates</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          {template.icon}
                        </div>
                        <span className="text-gray-500">Preview</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {template.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {template.rating}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Download className="w-3 h-3" />
                          {template.downloads}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTemplate(template)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedTemplate.icon}
                {selectedTemplate.name}
              </DialogTitle>
              <DialogDescription>{selectedTemplate.description}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={`data:text/html,${encodeURIComponent(selectedTemplate.files[0].content || "")}`}
                className="w-full h-full border-0"
                title="Template Preview"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Close
              </Button>
              <Button onClick={() => handleUseTemplate(selectedTemplate)} className="bg-purple-600 hover:bg-purple-700">
                Use This Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
