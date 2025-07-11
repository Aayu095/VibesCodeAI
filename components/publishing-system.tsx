"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
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
import { Globe, Eye, Copy, ExternalLink, Trash2, Calendar, Users, Heart } from "lucide-react"
import type { Project } from "@/app/page"

interface PublishedSite {
  id: string
  name: string
  description: string
  url: string
  project: Project
  publishedAt: Date
  views: number
  likes: number
  comments: number
  isPublic: boolean
  tags: string[]
}

interface PublishingSystemProps {
  currentProject: Project
  onClose: () => void
}

export function PublishingSystem({ currentProject, onClose }: PublishingSystemProps) {
  const [publishedSites, setPublishedSites] = useState<PublishedSite[]>([])
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false)
  const [siteToUnpublish, setSiteToUnpublish] = useState<string | null>(null)
  const [publishForm, setPublishForm] = useState({
    name: currentProject.name,
    description: "",
    tags: "",
    isPublic: true,
  })
  const [activeTab, setActiveTab] = useState<"my-sites" | "gallery">("my-sites")

  // Load published sites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vibescode-published-sites")
    if (saved) {
      try {
        const sites = JSON.parse(saved).map((s: any) => ({
          ...s,
          publishedAt: new Date(s.publishedAt),
          project: {
            ...s.project,
            lastModified: new Date(s.project.lastModified),
          },
        }))
        setPublishedSites(sites)
      } catch (error) {
        console.error("Failed to load published sites:", error)
      }
    }
  }, [])

  // Save sites to localStorage
  const saveSitesToStorage = (sites: PublishedSite[]) => {
    localStorage.setItem("vibescode-published-sites", JSON.stringify(sites))
    setPublishedSites(sites)
  }

  const generatePublicUrl = (siteId: string) => {
    return `${window.location.origin}/published/${siteId}`
  }

  const handlePublish = () => {
    if (!publishForm.name.trim()) return

    const publishedSite: PublishedSite = {
      id: Date.now().toString(),
      name: publishForm.name.trim(),
      description: publishForm.description.trim(),
      url: generatePublicUrl(Date.now().toString()),
      project: { ...currentProject },
      publishedAt: new Date(),
      views: 0,
      likes: 0,
      comments: 0,
      isPublic: publishForm.isPublic,
      tags: publishForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    // Store the published site content
    const siteContent = currentProject.files.find((f) => f.name === "index.html")?.content || ""
    localStorage.setItem(`published-site-${publishedSite.id}`, siteContent)

    const updatedSites = [publishedSite, ...publishedSites]
    saveSitesToStorage(updatedSites)

    setShowPublishDialog(false)
    setPublishForm({
      name: currentProject.name,
      description: "",
      tags: "",
      isPublic: true,
    })
  }

  const handleUnpublish = (siteId: string) => {
    setSiteToUnpublish(siteId)
    setShowUnpublishDialog(true)
  }

  const confirmUnpublish = () => {
    if (siteToUnpublish) {
      // Remove from published sites
      const updatedSites = publishedSites.filter((s) => s.id !== siteToUnpublish)
      saveSitesToStorage(updatedSites)

      // Remove stored content
      localStorage.removeItem(`published-site-${siteToUnpublish}`)

      setSiteToUnpublish(null)
      setShowUnpublishDialog(false)
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  const handleViewSite = (site: PublishedSite) => {
    // Simulate view increment
    const updatedSites = publishedSites.map((s) => (s.id === site.id ? { ...s, views: s.views + 1 } : s))
    saveSitesToStorage(updatedSites)

    // Open in new tab with the site content
    const content = localStorage.getItem(`published-site-${site.id}`)
    if (content) {
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(content)
        newWindow.document.close()
      }
    }
  }

  const mySites = publishedSites
  const publicGallery = publishedSites.filter((s) => s.isPublic).sort((a, b) => b.views - a.views)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Publishing Center</h2>
            <p className="text-gray-600">Publish your websites and share them with the world</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab("my-sites")}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "my-sites"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              My Published Sites
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "gallery"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Public Gallery
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "my-sites" ? (
            <div className="h-full flex flex-col">
              {/* Actions Bar */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">Your Published Sites</h3>
                    <p className="text-sm text-gray-600">{mySites.length} sites published</p>
                  </div>
                  <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Globe className="w-4 h-4 mr-2" />
                        Publish Current Site
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Publish Your Website</DialogTitle>
                        <DialogDescription>
                          Make your website accessible to everyone with a public link
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Site Name</label>
                          <Input
                            value={publishForm.name}
                            onChange={(e) => setPublishForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter site name..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Description</label>
                          <Textarea
                            value={publishForm.description}
                            onChange={(e) => setPublishForm((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of your site..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                          <Input
                            value={publishForm.tags}
                            onChange={(e) => setPublishForm((prev) => ({ ...prev, tags: e.target.value }))}
                            placeholder="portfolio, business, landing-page..."
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isPublic"
                            checked={publishForm.isPublic}
                            onChange={(e) => setPublishForm((prev) => ({ ...prev, isPublic: e.target.checked }))}
                            className="rounded"
                          />
                          <label htmlFor="isPublic" className="text-sm text-gray-700">
                            Make this site publicly discoverable in the gallery
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handlePublish} disabled={!publishForm.name.trim()}>
                          Publish Site
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Sites List */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    {mySites.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {mySites.map((site) => (
                          <SiteCard
                            key={site.id}
                            site={site}
                            onView={handleViewSite}
                            onCopyUrl={handleCopyUrl}
                            onUnpublish={handleUnpublish}
                            showOwnerActions={true}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Globe className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No published sites yet</h3>
                        <p className="text-gray-600 mb-4">Publish your first website to share it with the world</p>
                        <Button
                          onClick={() => setShowPublishDialog(true)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Publish Current Site
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Gallery Header */}
              <div className="p-6 border-b bg-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-900">Public Gallery</h3>
                  <p className="text-sm text-gray-600">Discover amazing websites created by the community</p>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    {publicGallery.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publicGallery.map((site) => (
                          <SiteCard
                            key={site.id}
                            site={site}
                            onView={handleViewSite}
                            onCopyUrl={handleCopyUrl}
                            onUnpublish={handleUnpublish}
                            showOwnerActions={false}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No public sites yet</h3>
                        <p className="text-gray-600">Be the first to publish a site to the public gallery!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unpublish Confirmation Dialog */}
      <AlertDialog open={showUnpublishDialog} onOpenChange={setShowUnpublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unpublish Site</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unpublish this site? The public link will no longer work and the site will be
              removed from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnpublish} className="bg-red-600 hover:bg-red-700">
              Unpublish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface SiteCardProps {
  site: PublishedSite
  onView: (site: PublishedSite) => void
  onCopyUrl: (url: string) => void
  onUnpublish: (siteId: string) => void
  showOwnerActions: boolean
}

function SiteCard({ site, onView, onCopyUrl, onUnpublish, showOwnerActions }: SiteCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{site.name}</CardTitle>
            {site.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{site.description}</p>}
          </div>
          {site.isPublic && (
            <Badge variant="secondary" className="ml-2">
              Public
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Tags */}
        {site.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {site.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {site.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{site.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {site.views}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {site.likes}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {site.publishedAt.toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onView(site)} className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => onCopyUrl(site.url)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.open(site.url, "_blank")}>
            <ExternalLink className="w-4 h-4" />
          </Button>
          {showOwnerActions && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUnpublish(site.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
