"use client"

import { useEffect, useRef, useState } from "react"
import type { FileNode } from "@/app/page"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink, Smartphone, Monitor, Maximize2 } from "lucide-react"

interface PreviewPaneProps {
  files: FileNode[]
}

export function PreviewPane({ files }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isMobile, setIsMobile] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    generatePreview()
  }, [files])

  const generatePreview = () => {
    const htmlFile = files.find((f) => f.name === "index.html")
    if (!htmlFile || !htmlFile.content) return

    let htmlContent = htmlFile.content

    // Inject other files (CSS, JS) into the HTML
    const cssFiles = files.filter((f) => f.name.endsWith(".css"))
    const jsFiles = files.filter((f) => f.name.endsWith(".js"))

    // Add CSS files
    cssFiles.forEach((cssFile) => {
      if (cssFile.content) {
        htmlContent = htmlContent.replace("</head>", `<style>${cssFile.content}</style></head>`)
      }
    })

    // Add JS files
    jsFiles.forEach((jsFile) => {
      if (jsFile.content) {
        htmlContent = htmlContent.replace("</body>", `<script>${jsFile.content}</script></body>`)
      }
    })

    // Create blob URL
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }

  const refreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank")
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div
      className={`flex flex-col bg-white rounded-lg border shadow-sm h-full overflow-hidden ${
        isFullscreen ? "fixed inset-4 z-50" : ""
      }`}
    >
      {/* Preview Header - Compact */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-sm font-medium text-gray-700">Live Preview</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobile(!isMobile)}
            className={`h-8 px-2 ${isMobile ? "bg-purple-100 text-purple-700" : "text-gray-600"}`}
          >
            {isMobile ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={refreshPreview} className="h-8 px-2 text-gray-600">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={openInNewTab} className="h-8 px-2 text-gray-600">
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-8 px-2 text-gray-600">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content - Full Height */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-2 overflow-hidden">
        <div
          className={`bg-white rounded-lg shadow-lg transition-all duration-300 h-full overflow-hidden ${
            isMobile
              ? "w-[375px] max-w-[375px]" // iPhone size
              : "w-full"
          }`}
        >
          {previewUrl ? (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full rounded-lg border-0"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Monitor className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No preview available</p>
                <p className="text-sm text-gray-400">Generate code to see preview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar - Minimal */}
      <div className="flex items-center justify-between px-4 py-1 border-t bg-gray-50/50 text-xs text-gray-500 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>Ready</span>
          {previewUrl && <span className="text-green-600">● Live</span>}
        </div>
        <div className="flex items-center gap-2">
          <span>{isMobile ? "Mobile" : "Desktop"} View</span>
          {isMobile && <span>375px</span>}
        </div>
      </div>
    </div>
  )
}
