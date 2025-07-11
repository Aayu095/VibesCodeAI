"use client"

import { useState } from "react"
import type { FileNode } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  File,
  Folder,
  FileText,
  Code,
  ImageIcon,
  Plus,
  MoreHorizontal,
  FolderPlus,
  FilePlus,
  Trash2,
  Edit3,
  Copy,
  ScissorsIcon as Cut,
  Download,
  Upload,
} from "lucide-react"
import type { JSX } from "react/jsx-runtime"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FileExplorerProps {
  files: FileNode[]
  selectedFile: FileNode
  onFileSelect: (file: FileNode) => void
  onFileCreate?: (name: string, type: "file" | "folder", parentPath?: string) => void
  onFileDelete?: (path: string) => void
  onFileRename?: (oldPath: string, newName: string) => void
  onFileCopy?: (path: string) => void
  onFileCut?: (path: string) => void
}

export function FileExplorer({
  files,
  selectedFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileCopy,
  onFileCut,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]))
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createType, setCreateType] = useState<"file" | "folder">("file")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)

  const getFileIcon = (fileName: string, type: string) => {
    if (type === "folder") return <Folder className="w-4 h-4 text-blue-500" />

    const ext = fileName.split(".").pop()?.toLowerCase()

    const iconMap: Record<string, JSX.Element> = {
      html: <FileText className="w-4 h-4 text-orange-500" />,
      htm: <FileText className="w-4 h-4 text-orange-500" />,
      css: <Code className="w-4 h-4 text-blue-500" />,
      scss: <Code className="w-4 h-4 text-pink-500" />,
      sass: <Code className="w-4 h-4 text-pink-500" />,
      js: <Code className="w-4 h-4 text-yellow-500" />,
      jsx: <Code className="w-4 h-4 text-blue-400" />,
      ts: <Code className="w-4 h-4 text-blue-600" />,
      tsx: <Code className="w-4 h-4 text-blue-600" />,
      json: <Code className="w-4 h-4 text-green-500" />,
      md: <FileText className="w-4 h-4 text-gray-600" />,
      png: <ImageIcon className="w-4 h-4 text-green-500" />,
      jpg: <ImageIcon className="w-4 h-4 text-green-500" />,
      jpeg: <ImageIcon className="w-4 h-4 text-green-500" />,
      gif: <ImageIcon className="w-4 h-4 text-green-500" />,
      svg: <ImageIcon className="w-4 h-4 text-purple-500" />,
    }

    return iconMap[ext || ""] || <File className="w-4 h-4 text-gray-500" />
  }

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const handleCreateFile = (type: "file" | "folder") => {
    setCreateType(type)
    setShowCreateDialog(true)
    setNewFileName("")
  }

  const confirmCreate = () => {
    if (newFileName.trim() && onFileCreate) {
      onFileCreate(newFileName.trim(), createType)
      setShowCreateDialog(false)
      setNewFileName("")
    }
  }

  const handleDelete = (file: FileNode) => {
    setFileToDelete(file.path)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (fileToDelete && onFileDelete) {
      onFileDelete(fileToDelete)
      setShowDeleteDialog(false)
      setFileToDelete(null)
    }
  }

  const startRename = (file: FileNode) => {
    setEditingFile(file.path)
    setNewFileName(file.name)
  }

  const confirmRename = (oldPath: string) => {
    if (newFileName.trim() && newFileName !== oldPath.split("/").pop() && onFileRename) {
      onFileRename(oldPath, newFileName.trim())
    }
    setEditingFile(null)
    setNewFileName("")
  }

  const handleCopy = (file: FileNode) => {
    if (onFileCopy) {
      onFileCopy(file.path)
    }
  }

  const handleCut = (file: FileNode) => {
    if (onFileCut) {
      onFileCut(file.path)
    }
  }

  const downloadFile = (file: FileNode) => {
    if (file.content) {
      const blob = new Blob([file.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedFolders.has(node.path)
      const isEditing = editingFile === node.path

      return (
        <div key={node.path}>
          <div
            className={`flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded group ${
              selectedFile.path === node.path ? "bg-purple-100 border-l-2 border-purple-500" : ""
            }`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            {node.type === "folder" && (
              <button onClick={() => toggleFolder(node.path)} className="p-0.5 hover:bg-gray-200 rounded">
                <div className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`}>▶</div>
              </button>
            )}

            <div
              className="flex items-center gap-2 flex-1 min-w-0"
              onClick={() => {
                if (node.type === "file") {
                  onFileSelect(node)
                } else {
                  toggleFolder(node.path)
                }
              }}
            >
              {getFileIcon(node.name, node.type)}

              {isEditing ? (
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onBlur={() => confirmRename(node.path)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      confirmRename(node.path)
                    } else if (e.key === "Escape") {
                      setEditingFile(null)
                    }
                  }}
                  className="h-6 text-sm"
                  autoFocus
                />
              ) : (
                <span className="text-sm font-medium text-gray-700 truncate">{node.name}</span>
              )}
            </div>

            {node.type === "file" && !isEditing && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-400">{node.content?.length || 0}</span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startRename(node)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopy(node)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCut(node)}>
                      <Cut className="w-4 h-4 mr-2" />
                      Cut
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadFile(node)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(node)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {node.children && isExpanded && renderFileTree(node.children, depth + 1)}
        </div>
      )
    })
  }

  return (
    <>
      <div className="h-full flex flex-col bg-white rounded-lg border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50 flex-shrink-0">
          <h3 className="font-medium text-gray-800">Explorer</h3>
          <div className="flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleCreateFile("file")}>
                  <FilePlus className="w-4 h-4 mr-2" />
                  New File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateFile("folder")}>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2">
              {files.length > 0 ? (
                renderFileTree(files)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No files yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-transparent"
                    onClick={() => handleCreateFile("file")}
                  >
                    Create your first file
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="p-2 border-t bg-gray-50 text-xs text-gray-500 flex-shrink-0">
          <div className="flex justify-between">
            <span>{files.length} items</span>
            <span>
              {files.filter((f) => f.type === "file").length} files, {files.filter((f) => f.type === "folder").length}{" "}
              folders
            </span>
          </div>
        </div>
      </div>

      {/* Create File/Folder Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New {createType === "file" ? "File" : "Folder"}</DialogTitle>
            <DialogDescription>Enter a name for the new {createType}.</DialogDescription>
          </DialogHeader>
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder={createType === "file" ? "filename.ext" : "folder-name"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                confirmCreate()
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCreate} disabled={!newFileName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
