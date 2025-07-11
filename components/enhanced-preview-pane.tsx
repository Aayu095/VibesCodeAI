"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  Maximize,
  ExternalLink,
  Loader2,
  Code2,
  Palette,
  Zap,
  Globe,
} from "lucide-react"
import type { FileNode } from "@/app/page"

interface EnhancedPreviewPaneProps {
  files: FileNode[]
  isGenerating: boolean
  generationStage: string
}

type ViewportSize = "desktop" | "tablet" | "mobile"

export function EnhancedPreviewPane({ files, isGenerating, generationStage }: EnhancedPreviewPaneProps) {
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const getViewportDimensions = () => {
    switch (viewportSize) {
      case "mobile":
        return { width: "375px", height: "667px" }
      case "tablet":
        return { width: "768px", height: "1024px" }
      default:
        return { width: "100%", height: "100%" }
    }
  }

  const generatePreviewContent = () => {
    const htmlFile = files.find((file) => file.name.endsWith(".html"))
    const cssFile = files.find((file) => file.name.endsWith(".css"))
    const jsFile = files.find((file) => file.name.endsWith(".js"))

    if (!htmlFile?.content) {
      return `
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="text-center">
              <div class="text-6xl mb-4">🎨</div>
              <h1 class="text-2xl font-bold text-gray-800 mb-2">No Content Yet</h1>
              <p class="text-gray-600">Generate a website to see the preview</p>
            </div>
          </body>
        </html>
      `
    }

    let content = htmlFile.content

    // Inject CSS if available
    if (cssFile?.content) {
      const cssTag = `<style>${cssFile.content}</style>`
      content = content.replace("</head>", `${cssTag}</head>`)
    }

    // Inject JavaScript if available
    if (jsFile?.content) {
      const jsTag = `<script>${jsFile.content}</script>`
      content = content.replace("</body>", `${jsTag}</body>`)
    }

    return content
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (iframeRef.current) {
      const content = generatePreviewContent()
      const blob = new Blob([content], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      iframeRef.current.src = url
    }

    setIsRefreshing(false)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleExternalLink = () => {
    const content = generatePreviewContent()
    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
  }

  useEffect(() => {
    if (iframeRef.current && !isGenerating) {
      const content = generatePreviewContent()
      const blob = new Blob([content], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      iframeRef.current.src = url

      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [files, isGenerating])

  const getGenerationMessage = () => {
    switch (generationStage) {
      case "analyzing":
        return "Analyzing your request..."
      case "implementing":
        return "Building your website..."
      case "finalizing":
        return "Adding finishing touches..."
      default:
        return "Generating..."
    }
  }

  const getTechBadges = () => {
    const badges = []

    if (files.some((f) => f.content?.includes("<!DOCTYPE html>"))) {
      badges.push({ icon: Code2, label: "HTML5", color: "bg-orange-100 text-orange-700" })
    }

    if (
      files.some((f) => f.content?.includes("@media") || f.content?.includes("grid") || f.content?.includes("flex"))
    ) {
      badges.push({ icon: Palette, label: "CSS3", color: "bg-blue-100 text-blue-700" })
    }

    if (files.some((f) => f.content?.includes("tailwindcss"))) {
      badges.push({ icon: Zap, label: "TailwindCSS", color: "bg-cyan-100 text-cyan-700" })
    }

    if (
      files.some(
        (f) => f.content?.includes("addEventListener") || f.content?.includes("const ") || f.content?.includes("=>"),
      )
    ) {
      badges.push({ icon: Globe, label: "JavaScript ES6+", color: "bg-yellow-100 text-yellow-700" })
    }

    return badges
  }

  if (isGenerating) {
    return (
      <Card className="h-full flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Website Preview</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20 animate-pulse"></div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">Creating Your Website</h3>
            <p className="text-gray-600 mb-4">{getGenerationMessage()}</p>

            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">HTML5</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">CSS3</span>
              <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">TailwindCSS</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                JavaScript ES6+
              </span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  const dimensions = getViewportDimensions()
  const techBadges = getTechBadges()

  return (
    <Card className={`h-full flex flex-col ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-800">Website Preview</h3>

            {techBadges.length > 0 && (
              <div className="flex gap-2">
                {techBadges.map((badge, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                  >
                    <badge.icon className="w-3 h-3" />
                    {badge.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Size Controls */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border">
              <Button
                variant={viewportSize === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("desktop")}
                className="h-8 w-8 p-0"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewportSize === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("tablet")}
                className="h-8 w-8 p-0"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewportSize === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("mobile")}
                className="h-8 w-8 p-0"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>

            <Button variant="outline" size="sm" onClick={handleFullscreen}>
              <Maximize className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleExternalLink}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
        <div
          className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden h-full"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>
              Viewport:{" "}
              {viewportSize === "desktop" ? "Desktop" : viewportSize === "tablet" ? "Tablet (768px)" : "Mobile (375px)"}
            </span>
            <span>Files: {files.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live Preview</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
