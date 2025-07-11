"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { FolderOpen, Plus, Search, Calendar, Code, Trash2, Download, Upload, Star, Clock } from "lucide-react"
import type { Project } from "@/app/page"

interface SavedProject extends Project {
  createdAt: Date
  updatedAt: Date
  isStarred: boolean
  description?: string
}

interface ProjectManagerProps {
  currentProject: Project
  onProjectLoad: (project: Project) => void
  onProjectSave: (project: Project) => void
  onClose: () => void
}

export function ProjectManager({ currentProject, onProjectLoad, onProjectSave, onClose }: ProjectManagerProps) {
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")

  // Load saved projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vibescode-projects")
    if (saved) {
      try {
        const projects = JSON.parse(saved).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          lastModified: new Date(p.lastModified),
        }))
        setSavedProjects(projects)
      } catch (error) {
        console.error("Failed to load saved projects:", error)
      }
    }
  }, [])

  // Save projects to localStorage
  const saveProjectsToStorage = (projects: SavedProject[]) => {
    localStorage.setItem("vibescode-projects", JSON.stringify(projects))
    setSavedProjects(projects)
  }

  const handleSaveProject = () => {
    if (!newProjectName.trim()) return

    const savedProject: SavedProject = {
      ...currentProject,
      id: Date.now().toString(),
      name: newProjectName.trim(),
      description: newProjectDescription.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isStarred: false,
    }

    const updatedProjects = [savedProject, ...savedProjects]
    saveProjectsToStorage(updatedProjects)
    onProjectSave(savedProject)

    setShowSaveDialog(false)
    setNewProjectName("")
    setNewProjectDescription("")
  }

  const handleLoadProject = (project: SavedProject) => {
    onProjectLoad(project)
    onClose()
  }

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId)
    setShowDeleteDialog(true)
  }

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      const updatedProjects = savedProjects.filter((p) => p.id !== projectToDelete)
      saveProjectsToStorage(updatedProjects)
      setProjectToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  const handleStarProject = (projectId: string) => {
    const updatedProjects = savedProjects.map((p) => (p.id === projectId ? { ...p, isStarred: !p.isStarred } : p))
    saveProjectsToStorage(updatedProjects)
  }

  const handleExportProject = (project: SavedProject) => {
    const dataStr = JSON.stringify(project, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${project.name}.json`
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
        const importedProject: SavedProject = {
          ...projectData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          lastModified: new Date(),
          isStarred: false,
        }

        const updatedProjects = [importedProject, ...savedProjects]
        saveProjectsToStorage(updatedProjects)
      } catch (error) {
        console.error("Failed to import project:", error)
        alert("Failed to import project. Please check the file format.")
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  const filteredProjects = savedProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const starredProjects = filteredProjects.filter((p) => p.isStarred)
  const recentProjects = filteredProjects
    .filter((p) => !p.isStarred)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Project Manager</h2>
            <p className="text-gray-600">Manage your saved projects and templates</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </Button>
        </div>

        {/* Actions Bar */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Save Current
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Project</DialogTitle>
                    <DialogDescription>Save your current project to access it later</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Project Name</label>
                      <Input
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Enter project name..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
                      <Input
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                        placeholder="Brief description..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProject} disabled={!newProjectName.trim()}>
                      Save Project
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <label className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </span>
                </Button>
                <input type="file" accept=".json" onChange={handleImportProject} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {/* Starred Projects */}
              {starredProjects.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Starred Projects
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {starredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onLoad={handleLoadProject}
                        onDelete={handleDeleteProject}
                        onStar={handleStarProject}
                        onExport={handleExportProject}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Projects */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  {starredProjects.length > 0 ? "Recent Projects" : "All Projects"}
                </h3>
                {recentProjects.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {recentProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onLoad={handleLoadProject}
                        onDelete={handleDeleteProject}
                        onStar={handleStarProject}
                        onExport={handleExportProject}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FolderOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? "Try adjusting your search terms" : "Save your first project to get started"}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setShowSaveDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Save Current Project
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface ProjectCardProps {
  project: SavedProject
  onLoad: (project: SavedProject) => void
  onDelete: (projectId: string) => void
  onStar: (projectId: string) => void
  onExport: (project: SavedProject) => void
}

function ProjectCard({ project, onLoad, onDelete, onStar, onExport }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{project.name}</CardTitle>
            {project.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStar(project.id)}
            className="text-gray-400 hover:text-yellow-500 ml-2"
          >
            <Star className={`w-4 h-4 ${project.isStarred ? "fill-yellow-500 text-yellow-500" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {project.updatedAt.toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Code className="w-3 h-3" />
            {project.files.length} files
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={() => onLoad(project)} className="flex-1 bg-purple-600 hover:bg-purple-700">
            Open
          </Button>
          <Button size="sm" variant="outline" onClick={() => onExport(project)}>
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(project.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
