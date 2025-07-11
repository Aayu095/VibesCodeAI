"use client"

import { useState } from "react"
import { ChatPanel } from "@/components/chat-panel"
import { PreviewPane } from "@/components/preview-pane"
import { CodeEditor } from "@/components/code-editor"
import { FileExplorer } from "@/components/file-explorer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles, Code, Eye, FolderOpen, Rocket, ArrowLeft, Share } from "lucide-react"
import type { Message } from "@/lib/types"
import type { FileNode, Project } from "@/app/page"

interface BuilderInterfaceProps {
  initialPrompt: string
  onBackToHome: () => void
}

export function BuilderInterface({ initialPrompt, onBackToHome }: BuilderInterfaceProps) {
  const [currentProject, setCurrentProject] = useState<Project>({
    id: "1",
    name: "My Website",
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
</head>
<body class="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
    <div class="container mx-auto px-4 py-16">
        <div class="text-center">
            <h1 class="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Welcome to Your Website
            </h1>
            <p class="text-xl text-gray-600 mb-8">
                Built with AI magic ✨
            </p>
            <button class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                Get Started
            </button>
        </div>
    </div>
</body>
</html>`,
      },
    ],
    lastModified: new Date(),
  })

  const [selectedFile, setSelectedFile] = useState<FileNode>(currentProject.files[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [hasProcessedInitialPrompt, setHasProcessedInitialPrompt] = useState(false)

  // Process initial prompt when component mounts
  useState(() => {
    if (initialPrompt && !hasProcessedInitialPrompt) {
      handlePromptSubmit(initialPrompt)
      setHasProcessedInitialPrompt(true)
    }
  })

  const handlePromptSubmit = async (prompt: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data.error && !data.fallback) {
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `❌ ${data.error}\n\nTo get your free Google AI API key:\n1. Visit https://aistudio.google.com/app/apikey\n2. Sign in with your Google account\n3. Click "Create API Key"\n4. Add it to your .env.local file as:\nGOOGLE_GENERATIVE_AI_API_KEY=your_key_here`,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev.slice(0, -1), errorMessage])
        return
      }

      if (data.files) {
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
            ? "🎨 Demo website generated! To enable full AI features, please configure your Google AI API key."
            : "🎉 Website generated successfully! Check out your new site in the preview pane.",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev.slice(0, -1), successMessage])
      }
    } catch (error) {
      console.error("Error generating code:", error)

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "❌ Something went wrong. Please try again or check your internet connection.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev.slice(0, -1), errorMessage])
    } finally {
      setIsGenerating(false)
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

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Chat (Smaller) */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5" />
              <h1 className="text-lg font-bold">VibesCode.AI</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={onBackToHome} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-purple-100 text-sm mt-1">AI Website Builder</p>
        </div>

        <ChatPanel
          onPromptSubmit={handlePromptSubmit}
          isGenerating={isGenerating}
          messages={messages}
          setMessages={setMessages}
          initialPrompt={initialPrompt}
        />
      </div>

      {/* Right Panel - Preview & Code (Larger) */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800">{currentProject.name}</h2>
              <span className="text-sm text-gray-500">
                Last modified: {currentProject.lastModified.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <FolderOpen className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Rocket className="w-4 h-4 mr-2" />
              Deploy
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="preview" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4 w-fit">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 m-4 mt-2">
            <PreviewPane files={currentProject.files} />
          </TabsContent>

          <TabsContent value="code" className="flex-1 m-4 mt-2 flex gap-4">
            <div className="w-80">
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
            <div className="flex-1">
              <CodeEditor file={selectedFile} onFileUpdate={handleFileUpdate} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
