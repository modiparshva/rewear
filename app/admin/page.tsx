"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, Users, Package, TrendingUp, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { Recycle } from "lucide-react"
import { cookies } from "next/headers"

interface Item {
  _id: string
  title: string
  description: string
  category: string
  condition: string
  points: number
  images: string[]
  status: string
  owner: {
    name: string
    email: string
    avatar?: string
  }
  createdAt: string
}

export default function AdminPage() {
  const [pendingItems, setPendingItems] = useState<Item[]>([])
  const [approvedItems, setApprovedItems] = useState<Item[]>([])
  const [rejectedItems, setRejectedItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    pendingReviews: 0,
    totalSwaps: 0,
  })

  useEffect(() => {
    fetchItems()
    fetchStats()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)

      // Fetch pending items
      const pendingResponse = await fetch("/api/admin/items?status=pending", {
        credentials: "include",
      })
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json()
        setPendingItems(pendingData.items || [])
      }

      // Fetch approved items
      const approvedResponse = await fetch("/api/admin/items?status=approved", {
        credentials: "include",
      })
      if (approvedResponse.ok) {
        const approvedData = await approvedResponse.json()
        setApprovedItems(approvedData.items || [])
      }

      // Fetch rejected items
      const rejectedResponse = await fetch("/api/admin/items?status=rejected", {
        credentials: "include",
      })
      if (rejectedResponse.ok) {
        const rejectedData = await rejectedResponse.json()
        setRejectedItems(rejectedData.items || [])
      }
    } catch (error) {
      console.error("Error fetching items:", error)
      toast.error("Failed to fetch items")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats for now - you can implement actual API endpoints
      // For a real app, you'd have API endpoints like /api/admin/stats
      setStats({
        totalUsers: 1250,
        totalItems: 3400,
        pendingReviews: pendingItems.length, // This will update after fetchItems
        totalSwaps: 890,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleApprove = async (itemId: string) => {
    try {
      const response = await fetch(`/api/admin/items/${itemId}/approve`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        toast.success("Item approved successfully!")
        fetchItems() // Re-fetch items to update lists
        fetchStats() // Re-fetch stats to update pending count
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to approve item")
      }
    } catch (error) {
      console.error("Error approving item:", error)
      toast.error("Failed to approve item")
    }
  }

  const handleReject = async (itemId: string) => {
    try {
      const response = await fetch(`/api/admin/items/${itemId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reason: rejectionReason }),
      })

      if (response.ok) {
        toast.success("Item rejected successfully!")
        setRejectionReason("")
        setSelectedItem(null)
        fetchItems() // Re-fetch items to update lists
        fetchStats() // Re-fetch stats to update pending count
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to reject item")
      }
    } catch (error) {
      console.error("Error rejecting item:", error)
      toast.error("Failed to reject item")
    }
  }

  const ItemCard = ({ item, showActions = true }: { item: Item; showActions?: boolean }) => (
    <Card key={item._id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>
              by {item.owner.name} • {new Date(item.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge
            variant={item.status === "pending" ? "secondary" : item.status === "approved" ? "default" : "destructive"}
          >
            {item.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Category</p>
              <p className="text-sm text-gray-600">{item.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Condition</p>
              <p className="text-sm text-gray-600">{item.condition}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Points</p>
              <p className="text-sm text-gray-600">{item.points}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Images</p>
              <p className="text-sm text-gray-600">{item.images.length} photos</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Description</p>
            <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
          </div>

          {item.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {item.images.slice(0, 3).map((image, index) => (
                <Image
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${item.title} ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-20 object-cover rounded"
                />
              ))}
            </div>
          )}

          {showActions && item.status === "pending" && (
            <div className="flex gap-2 pt-4">
              <Button onClick={() => handleApprove(item._id)} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex-1" onClick={() => setSelectedItem(item)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Item</DialogTitle>
                    <DialogDescription>Please provide a reason for rejecting "{item.title}"</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reason">Rejection Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Explain why this item doesn't meet our standards..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(item._id)}
                      disabled={!rejectionReason.trim()}
                    >
                      Reject Item
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">ReWear Admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-gray-600 hover:text-gray-900">
              Browse
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage items, users, and platform operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold">{pendingItems.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                  <p className="text-2xl font-bold">{stats.totalSwaps.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Management */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved ({approvedItems.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejected ({rejectedItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Items Pending Review</h2>
              {pendingItems.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending items</h3>
                    <p className="text-gray-600">All items have been reviewed!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingItems.map((item) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Approved Items</h2>
              {approvedItems.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No approved items</h3>
                    <p className="text-gray-600">No items have been approved yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedItems.map((item) => (
                    <ItemCard key={item._id} item={item} showActions={false} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Rejected Items</h2>
              {rejectedItems.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No rejected items</h3>
                    <p className="text-gray-600">No items have been rejected.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rejectedItems.map((item) => (
                    <ItemCard key={item._id} item={item} showActions={false} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
