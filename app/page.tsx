"use client"

import type React from "react"

import { useState } from "react"
import { HomePage } from "@/components/home-page"
import { AuthPage } from "@/components/auth-page"
import { TemplateGallery } from "@/components/template-gallery"
import { ProjectManager } from "@/components/project-manager"
import { PublishingSystem } from "@/components/publishing-system"
import { EnhancedChatPanel } from "@/components/enhanced-chat-panel"
import { EnhancedPreviewPane } from "@/components/enhanced-preview-pane"
import { CodeEditor } from "@/components/code-editor"
import { FileExplorer } from "@/components/file-explorer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Code,
  Eye,
  FolderOpen,
  ArrowLeft,
  Share,
  Download,
  Upload,
  Globe,
  LayoutTemplateIcon as Template,
  Save,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Message } from "@/lib/types"

export interface FileNode {
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
  path: string
}

export interface Project {
  id: string
  name: string
  files: FileNode[]
  lastModified: Date
}

type AppState = "home" | "auth" | "builder"

export default function App() {
  const [appState, setAppState] = useState<AppState>("home")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [initialPrompt, setInitialPrompt] = useState("")
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  const [showProjectManager, setShowProjectManager] = useState(false)
  const [showPublishingSystem, setShowPublishingSystem] = useState(false)

  const [currentProject, setCurrentProject] = useState<Project>({
    id: "1",
    name: "My Modern Website",
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
    <title>Welcome to VibesCode.AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen gradient-bg flex items-center justify-center text-white">
        <div class="text-center max-w-4xl mx-auto px-6">
            <h1 class="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                Welcome to
                <span class="block text-purple-200">VibesCode.AI</span>
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-purple-100">
                Built with modern web technologies ✨
            </p>
            <button class="bg-white/20 backdrop-blur-md px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105 border border-white/30">
                Start Building
            </button>
        </div>
    </div>
    
    <script>
        console.log('🚀 VibesCode.AI - Modern website builder ready!');
        
        // Add smooth hover effects
        document.querySelector('button').addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        document.querySelector('button').addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    </script>
</body>
</html>`,
      },
    ],
    lastModified: new Date(),
  })

  const [selectedFile, setSelectedFile] = useState<FileNode>(currentProject.files[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStage, setGenerationStage] = useState("analyzing")
  const [messages, setMessages] = useState<Message[]>([])

  const handlePromptSubmit = async (prompt: string) => {
    console.log("🚀 Starting website generation for:", prompt)
    setIsGenerating(true)
    setGenerationStage("analyzing")

    try {
      // Add a small delay to show the generation UI
      await new Promise((resolve) => setTimeout(resolve, 500))
      setGenerationStage("implementing")

      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      console.log("📡 API Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("📦 API Response data:", data)

      // The API now ALWAYS returns a successful response with files
      if (data.files && Array.isArray(data.files) && data.files.length > 0) {
        setGenerationStage("finalizing")

        const newProject = {
          ...currentProject,
          files: data.files,
          lastModified: new Date(),
        }
        setCurrentProject(newProject)
        setSelectedFile(data.files[0])

        const successMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: data.fallback
            ? `🎨 **Website generated successfully!** 

${data.message || "Using demo mode while AI service is busy"}

Your website includes:

✅ **HTML5** - Semantic markup and modern structure
✅ **CSS3** - Advanced styling with animations
✅ **TailwindCSS** - Utility-first responsive design
✅ **JavaScript ES6+** - Interactive features and smooth effects
✅ **Responsive Design** - Perfect on all devices
✅ **Accessibility** - WCAG compliant and keyboard friendly

Check out your new site in the preview pane! 🚀`
            : `🎉 **Modern website generated successfully!** 

Your website has been built using cutting-edge technologies:

✅ **HTML5** - Semantic markup and modern structure
✅ **CSS3** - Advanced styling with animations  
✅ **TailwindCSS** - Utility-first responsive design
✅ **JavaScript ES6+** - Interactive features and smooth effects
✅ **Responsive Design** - Perfect on all devices
✅ **Accessibility** - WCAG compliant and keyboard friendly

Check out your new site in the preview pane! 🚀`,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev.slice(0, -1), successMessage])
        console.log("✅ Website generation completed successfully")
      } else {
        throw new Error("Invalid response format - no files received")
      }
    } catch (error: any) {
      console.error("❌ Error generating code:", error)

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "⚠️ **Generation temporarily unavailable** \n\nThere was an issue connecting to the generation service. This could be due to:\n\n• High server traffic\n• Network connectivity issues\n• Temporary service maintenance\n\nPlease try again in a few moments. You can also try with a simpler request or check if your internet connection is stable.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev.slice(0, -1), errorMessage])
    } finally {
      setIsGenerating(false)
      setGenerationStage("complete")
    }
  }

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file)
  }

  const handleFileUpdate = (path: string, content: string) => {
    const updateFileInTree = (files: FileNode[]): FileNode[] => {
      return files.map((file) => {
        if (file.path === path) {
          return { ...file, content }
        }
        if (file.children) {
          return { ...file, children: updateFileInTree(file.children) }
        }
        return file
      })
    }

    const updatedProject = {
      ...currentProject,
      files: updateFileInTree(currentProject.files),
      lastModified: new Date(),
    }

    setCurrentProject(updatedProject)
    if (selectedFile.path === path) {
      setSelectedFile({ ...selectedFile, content })
    }
  }

  const handleFileCreate = (name: string, type: "file" | "folder", parentPath?: string) => {
    const newPath = `/${name}`
    const newFile: FileNode = {
      name,
      type,
      path: newPath,
      content: type === "file" ? "" : undefined,
      children: type === "folder" ? [] : undefined,
    }

    const updatedProject = {
      ...currentProject,
      files: [...currentProject.files, newFile],
      lastModified: new Date(),
    }

    setCurrentProject(updatedProject)
    if (type === "file") {
      setSelectedFile(newFile)
    }
  }

  const handleFileDelete = (path: string) => {
    const updatedProject = {
      ...currentProject,
      files: currentProject.files.filter((file) => file.path !== path),
      lastModified: new Date(),
    }

    setCurrentProject(updatedProject)

    if (selectedFile.path === path && updatedProject.files.length > 0) {
      setSelectedFile(updatedProject.files[0])
    }
  }

  const handleFileRename = (oldPath: string, newName: string) => {
    const updatedFiles = currentProject.files.map((file) => {
      if (file.path === oldPath) {
        const newPath = oldPath.replace(file.name, newName)
        return { ...file, name: newName, path: newPath }
      }
      return file
    })

    const updatedProject = {
      ...currentProject,
      files: updatedFiles,
      lastModified: new Date(),
    }

    setCurrentProject(updatedProject)

    if (selectedFile.path === oldPath) {
      const renamedFile = updatedFiles.find((f) => f.name === newName)
      if (renamedFile) {
        setSelectedFile(renamedFile)
      }
    }
  }

  const handleFileCopy = (path: string) => {
    const file = currentProject.files.find((f) => f.path === path)
    if (file && file.content) {
      navigator.clipboard.writeText(file.content)
    }
  }

  const handleFileCut = (path: string) => {
    handleFileCopy(path)
  }

  const handleStartBuilding = (prompt: string) => {
    if (!isAuthenticated) {
      setInitialPrompt(prompt)
      setAppState("auth")
    } else {
      setInitialPrompt(prompt)
      setAppState("builder")
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setAppState("builder")
  }

  const handleBackToHome = () => {
    setAppState("home")
    setInitialPrompt("")
  }

  const handleSignInClick = () => {
    setAppState("auth")
  }

  const handleTemplateSelect = (template: any) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: template.name,
      files: template.files,
      lastModified: new Date(),
    }
    setCurrentProject(newProject)
    setSelectedFile(newProject.files[0])
  }

  const handleProjectLoad = (project: Project) => {
    setCurrentProject(project)
    setSelectedFile(project.files[0])
  }

  const handleProjectSave = (project: Project) => {
    setCurrentProject(project)
  }

  const handleExportProject = () => {
    const dataStr = JSON.stringify(currentProject, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${currentProject.name}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target?.result as string)
        const importedProject: Project = {
          ...projectData,
          id: Date.now().toString(),
          lastModified: new Date(),
        }
        setCurrentProject(importedProject)
        setSelectedFile(importedProject.files[0])
      } catch (error) {
        console.error("Failed to import project:", error)
        alert("Failed to import project. Please check the file format.")
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  // Render Authentication Page
  if (appState === "auth") {
    return <AuthPage onAuthSuccess={handleAuthSuccess} onBackToHome={handleBackToHome} />
  }

  // Render Builder Interface
  if (appState === "builder") {
    return (
      <>
        <div className="h-screen flex bg-gray-50 overflow-hidden">
          {/* Left Panel - Enhanced Chat */}
          <div className="w-80 border-r bg-white flex flex-col">
            <div className="p-3 border-b bg-gradient-to-r from-purple-600 to-pink-600 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5" />
                  <h1 className="text-lg font-bold">VibesCode.AI</h1>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBackToHome} className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-purple-100 text-xs mt-1">Modern AI Website Builder</p>
            </div>

            <div className="flex-1 overflow-hidden">
              <EnhancedChatPanel
                onPromptSubmit={handlePromptSubmit}
                isGenerating={isGenerating}
                messages={messages}
                setMessages={setMessages}
                initialPrompt={initialPrompt}
                generationStage={generationStage}
              />
            </div>
          </div>

          {/* Right Panel - Enhanced Preview & Code */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2 border-b bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-800">{currentProject.name}</h2>
                  <span className="text-xs text-gray-500">{currentProject.lastModified.toLocaleTimeString()}</span>
                  {isGenerating && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                      Generating...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FolderOpen className="w-4 h-4 mr-1" />
                      File
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowProjectManager(true)}>
                      <Save className="w-4 h-4 mr-2" />
                      Save / Load Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowTemplateGallery(true)}>
                      <Template className="w-4 h-4 mr-2" />
                      Browse Templates
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleExportProject}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Project
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <label className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Project
                        <input type="file" accept=".json" onChange={handleImportProject} className="hidden" />
                      </label>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm" onClick={() => setShowPublishingSystem(true)}>
                  <Globe className="w-4 h-4 mr-1" />
                  Publish
                </Button>

                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>

            {/* Tabs Container - Full Height */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
                {/* Tab List - Fixed */}
                <div className="px-4 pt-2 flex-shrink-0">
                  <TabsList className="w-fit">
                    <TabsTrigger value="preview" className="flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="code" className="flex items-center gap-2 text-sm">
                      <Code className="w-4 h-4" />
                      Code
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content - Full Height */}
                <TabsContent value="preview" className="flex-1 p-4 pt-2 overflow-hidden">
                  <EnhancedPreviewPane
                    files={currentProject.files}
                    isGenerating={isGenerating}
                    generationStage={generationStage}
                  />
                </TabsContent>

                <TabsContent value="code" className="flex-1 p-4 pt-2 overflow-hidden">
                  <div className="flex gap-4 h-full">
                    <div className="w-72 flex-shrink-0">
                      <FileExplorer
                        files={currentProject.files}
                        selectedFile={selectedFile}
                        onFileSelect={handleFileSelect}
                        onFileCreate={handleFileCreate}
                        onFileDelete={handleFileDelete}
                        onFileRename={handleFileRename}
                        onFileCopy={handleFileCopy}
                        onFileCut={handleFileCut}
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <CodeEditor file={selectedFile} onFileUpdate={handleFileUpdate} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showTemplateGallery && (
          <TemplateGallery onTemplateSelect={handleTemplateSelect} onClose={() => setShowTemplateGallery(false)} />
        )}

        {showProjectManager && (
          <ProjectManager
            currentProject={currentProject}
            onProjectLoad={handleProjectLoad}
            onProjectSave={handleProjectSave}
            onClose={() => setShowProjectManager(false)}
          />
        )}

        {showPublishingSystem && (
          <PublishingSystem currentProject={currentProject} onClose={() => setShowPublishingSystem(false)} />
        )}
      </>
    )
  }

  // Render Home Page
  return <HomePage onStartBuilding={handleStartBuilding} onSignInClick={handleSignInClick} />
}
