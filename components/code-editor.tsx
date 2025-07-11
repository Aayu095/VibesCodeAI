"use client"

import { useEffect, useRef, useState } from "react"
import type { FileNode } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Copy, Download, Settings, Maximize2, Minimize2, Search, Replace, Palette } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CodeEditorProps {
  file: FileNode
  onFileUpdate: (path: string, content: string) => void
}

// Monaco Editor will be loaded dynamically
let monaco: any = null
let editor: any = null

export function CodeEditor({ file, onFileUpdate }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [theme, setTheme] = useState<"vs-dark" | "vs-light">("vs-dark")

  useEffect(() => {
    loadMonacoEditor()
  }, [])

  useEffect(() => {
    if (isEditorReady && editor && file) {
      const language = getLanguageFromFileName(file.name)
      const model = monaco.editor.createModel(file.content || "", language)
      editor.setModel(model)

      // Set up change listener
      model.onDidChangeContent(() => {
        const content = model.getValue()
        onFileUpdate(file.path, content)
      })
    }
  }, [file, isEditorReady])

  const loadMonacoEditor = async () => {
    if (typeof window === "undefined") return

    try {
      // Load Monaco Editor dynamically
      const monacoEditor = await import("monaco-editor")
      monaco = monacoEditor

      // Configure Monaco
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)

      // Set up themes
      monaco.editor.defineTheme("vs-dark-custom", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955" },
          { token: "keyword", foreground: "569CD6" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
        ],
        colors: {
          "editor.background": "#1e1e1e",
          "editor.foreground": "#d4d4d4",
          "editorLineNumber.foreground": "#858585",
          "editor.selectionBackground": "#264f78",
          "editor.inactiveSelectionBackground": "#3a3d41",
        },
      })

      if (editorRef.current) {
        editor = monaco.editor.create(editorRef.current, {
          value: file.content || "",
          language: getLanguageFromFileName(file.name),
          theme: theme === "vs-dark" ? "vs-dark-custom" : "vs",
          automaticLayout: true,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          cursorStyle: "line",
          wordWrap: "on",
          folding: true,
          foldingHighlight: true,
          foldingStrategy: "indentation",
          showFoldingControls: "always",
          unfoldOnClickAfterEndOfLine: false,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: true,
          trimAutoWhitespace: true,
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          acceptSuggestionOnCommitCharacter: true,
          snippetSuggestions: "top",
          emptySelectionClipboard: false,
          copyWithSyntaxHighlighting: true,
          multiCursorModifier: "ctrlCmd",
          accessibilitySupport: "auto",
          find: {
            seedSearchStringFromSelection: "always",
            autoFindInSelection: "never",
          },
        })

        setIsEditorReady(true)
      }
    } catch (error) {
      console.error("Failed to load Monaco Editor:", error)
      // Fallback to textarea if Monaco fails to load
      setIsEditorReady(false)
    }
  }

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase()

    const languageMap: Record<string, string> = {
      html: "html",
      htm: "html",
      css: "css",
      scss: "scss",
      sass: "sass",
      less: "less",
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      json: "json",
      xml: "xml",
      md: "markdown",
      py: "python",
      php: "php",
      java: "java",
      c: "c",
      cpp: "cpp",
      cs: "csharp",
      go: "go",
      rs: "rust",
      rb: "ruby",
      sql: "sql",
      sh: "shell",
      yml: "yaml",
      yaml: "yaml",
    }

    return languageMap[ext || ""] || "plaintext"
  }

  const copyToClipboard = () => {
    if (editor) {
      const content = editor.getValue()
      navigator.clipboard.writeText(content)
    }
  }

  const downloadFile = () => {
    if (editor) {
      const content = editor.getValue()
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const formatCode = () => {
    if (editor) {
      editor.getAction("editor.action.formatDocument").run()
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "vs-dark" ? "vs-light" : "vs-dark"
    setTheme(newTheme)
    if (editor) {
      monaco.editor.setTheme(newTheme === "vs-dark" ? "vs-dark-custom" : "vs")
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleFind = () => {
    if (editor) {
      editor.getAction("actions.find").run()
    }
  }

  const handleReplace = () => {
    if (editor) {
      editor.getAction("editor.action.startFindReplaceAction").run()
    }
  }

  // Fallback textarea component
  const TextareaFallback = () => (
    <textarea
      value={file.content || ""}
      onChange={(e) => onFileUpdate(file.path, e.target.value)}
      className="w-full h-full resize-none border-none outline-none font-mono text-sm leading-relaxed bg-gray-900 text-gray-100 p-4"
      placeholder="Start typing your code..."
      spellCheck={false}
    />
  )

  return (
    <div
      className={`flex flex-col bg-white rounded-lg border h-full overflow-hidden ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">{file.name}</span>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">{getLanguageFromFileName(file.name)}</span>
          <span className="text-xs text-gray-500">{editor ? `${editor.getValue().split("\n").length} lines` : ""}</span>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={handleFind}>
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReplace}>
            <Replace className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadFile}>
            <Download className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={formatCode}>Format Code</DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                <Palette className="w-4 h-4 mr-2" />
                {theme === "vs-dark" ? "Light Theme" : "Dark Theme"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Editor Content - Full Height */}
      <div className="flex-1 relative overflow-hidden">
        {isEditorReady ? <div ref={editorRef} className="w-full h-full" /> : <TextareaFallback />}
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between p-2 border-t bg-gray-50 text-xs text-gray-500 flex-shrink-0">
        <div className="flex gap-4">
          <span>Lines: {editor ? editor.getValue().split("\n").length : (file.content || "").split("\n").length}</span>
          <span>Characters: {editor ? editor.getValue().length : (file.content || "").length}</span>
          <span>Language: {getLanguageFromFileName(file.name)}</span>
        </div>
        <div className="flex gap-2">
          <span>UTF-8</span>
          <span>LF</span>
          <span>{theme === "vs-dark" ? "Dark" : "Light"}</span>
        </div>
      </div>
    </div>
  )
}
