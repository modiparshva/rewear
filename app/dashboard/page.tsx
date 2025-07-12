"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import {
  Recycle,
  Package,
  Coins,
  Star,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  PlusCircle,
  TrendingUp,
  History,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  points: number
  rating: number
  totalRatings: number
  totalSwaps: number
  location?: {
    city: string
    state: string
    country: string
  }
  joinDate: string
  role: string
}

interface UserItem {
  _id: string
  title: string
  images: string[]
  status: string
  points: number
  createdAt: string
  views: number
  likes: number
}

interface SwapRequest {
  _id: string
  requestedItem: {
    _id: string
    title: string
    images: string[]
    points: number
  }
  offeredItem?: {
    _id: string
    title: string
    images: string[]
    points: number
  }
  requester: {
    _id: string
    name: string
    avatar?: string
  }
  owner: {
    _id: string
    name: string
    avatar?: string
  }
  swapType: "direct" | "points"
  pointsRequired: number
  pointsOffered: number
  pointsDifference: number
  message?: string
  status: string
  createdAt: string
}

interface PointsTransaction {
  _id: string
  type: "earned" | "spent" | "bonus" | "refund"
  amount: number
  description: string
  createdAt: string
  relatedItem?: {
    _id: string
    title: string
    images: string[]
  }
}

// Exporting Dashboard Page

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userItems, setUserItems] = useState<UserItem[]>([])
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock current user ID for demonstration. In a real app, this would come from session/auth context.
  const currentUserId = "user123" // This should be dynamically fetched from the session

  useEffect(() => {
    fetchUserProfile()
    fetchUserItems()
    fetchSwapRequests()
    fetchPointsHistory()
  }, [activeTab])

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user/profile")
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch user")
      }

      setUserProfile(data.user)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      toast.error("Failed to load profile.")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserItems = async () => {
    try {
      const res = await fetch("/api/user/items", { credentials: "include" })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to fetch items")

      setUserItems(data.items)
    } catch (error) {
      console.error("Error fetching user items:", error)
      toast.error("Failed to load your items.")
    }
  }


  const fetchSwapRequests = async () => {
    try {
      const res = await fetch("/api/swaps/request", { credentials: "include" })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to fetch swap requests")
      console.log("Swap requests data:", data)

      setSwapRequests(data.requests || [])
    } catch (error) {
      console.error("Error fetching swap requests:", error)
      toast.error("Failed to load swap requests.")
    }
  }


  const fetchPointsHistory = async () => {
    try {
      const res = await fetch("/api/points/history", { credentials: "include" })
      const text = await res.text() // capture full raw response

      // console.log("RAW RESPONSE:", text)

      const data = JSON.parse(text) // manually parse
      if (!res.ok) throw new Error(data.error || "Failed to fetch points history")

      setPointsHistory(data.history || [])
    } catch (error) {
      console.error("Error fetching points history:", error)
      toast.error("Failed to load points history.")
    }
  }


  const handleAcceptSwap = async (swapRequestId: string) => {
    try {
      const response = await fetch("/api/swaps/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ swapRequestId }),
      })

      if (response.ok) {
        toast.success("Swap accepted successfully!")
        fetchSwapRequests() // Refresh swap requests
        fetchUserProfile() // Refresh user points/swaps
        fetchUserItems() // Refresh item statuses
        fetchPointsHistory() // Refresh points history
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to accept swap.")
      }
    } catch (error) {
      console.error("Error accepting swap:", error)
      toast.error("An unexpected error occurred.")
    }
  }

  const handleRejectSwap = async (swapRequestId: string, reason: string) => {
    try {
      // In a real app, you'd have a /api/swaps/reject endpoint
      console.log(`Rejecting swap ${swapRequestId} with reason: ${reason}`)
      toast.success("Swap rejected successfully!")
      fetchSwapRequests() // Refresh swap requests
    } catch (error) {
      console.error("Error rejecting swap:", error)
      toast.error("An unexpected error occurred.")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Please log in to view your dashboard.</h3>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {userProfile.name}!</h1>
          <p className="text-gray-600">Your personal ReWear hub.</p>
        </div>

        {/* User Profile & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-gray-900">{userProfile.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{userProfile.email}</p>
              <Badge variant="secondary" className="mb-4">
                {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {userProfile.rating.toFixed(1)} ({userProfile.totalRatings})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {userProfile.location?.city}, {userProfile.location?.state}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                <Calendar className="h-3 w-3" />
                <span>Joined {userProfile.joinDate}</span>
              </div>
              <Button variant="outline" className="mt-4 w-full bg-transparent">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Your Points</p>
                  <p className="text-3xl font-bold text-green-600">{userProfile.points}</p>
                </div>
                <Coins className="h-10 w-10 text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Swaps</p>
                  <p className="text-3xl font-bold">{userProfile.totalSwaps}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-3xl font-bold">{userItems.filter((item) => item.status === "approved").length}</p>
                </div>
                <Package className="h-10 w-10 text-blue-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                  <p className="text-3xl font-bold">
                    {swapRequests.filter((req) => req.status === "pending" && req.owner._id === userProfile.id).length}
                  </p>
                </div>
                <MessageSquare className="h-10 w-10 text-orange-600" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs for detailed sections */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-items">My Items</TabsTrigger>
            <TabsTrigger value="swap-requests">Swap Requests</TabsTrigger>
            <TabsTrigger value="points-history">Points History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-auto py-4">
                  <Link href="/items/new" className="flex flex-col items-center gap-2">
                    <PlusCircle className="h-6 w-6" />
                    List New Item
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 bg-transparent">
                  <Link href="/browse" className="flex flex-col items-center gap-2">
                    <Eye className="h-6 w-6" />
                    Browse Items
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 bg-transparent">
                  <Link href="/dashboard?tab=swap-requests" className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-6 w-6" />
                    Manage Swaps
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {pointsHistory.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No recent activity.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pointsHistory.slice(0, 5).map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.type === "earned" || transaction.type === "bonus" ? "default" : "secondary"
                              }
                              className={
                                transaction.type === "earned" || transaction.type === "bonus"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }
                            >
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                            {transaction.amount > 0 ? "+" : ""}
                            {transaction.amount} pts
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-items" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Listed Items</CardTitle>
                <CardDescription>Manage your active, pending, and swapped items.</CardDescription>
              </CardHeader>
              <CardContent>
                {userItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't listed any items yet.</p>
                    <Button asChild>
                      <Link href="/items/new">List Your First Item</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userItems.map((item) => (
                      <Card key={item._id}>
                        <CardContent className="p-4">
                          <div className="relative mb-3">
                            <Image
                              src={item.images[0] || "/placeholder.svg"}
                              alt={item.title}
                              width={200}
                              height={150}
                              className="w-full h-36 object-cover rounded-md"
                            />
                            <Badge className="absolute top-2 left-2 bg-green-600">{item.points} pts</Badge>
                            <Badge
                              variant={
                                item.status === "approved"
                                  ? "default"
                                  : item.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="absolute top-2 right-2"
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Listed on {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{item.views} views</span>
                            <span>{item.likes} likes</span>
                          </div>
                          <Button asChild variant="outline" className="w-full mt-3 bg-transparent">
                            <Link href={`/items/${item._id}`}>View Details</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swap-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Swap Requests</CardTitle>
                <CardDescription>Review requests for your items.</CardDescription>
              </CardHeader>
              <CardContent>
                {swapRequests.filter((req) => req?.owner.toString() == userProfile.id && req.status === "pending").length ===
                  0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No incoming swap requests at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {swapRequests
                      .filter((req) => req?.owner.toString() == userProfile.id && req.status === "pending")
                      .map((request) => (
                        <Card key={request._id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4 mb-4">
                              <Avatar>
                                <AvatarImage src={request.requester.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{request.requester.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{request.requester.name} wants to swap for your:</p>
                                <Link
                                  href={`/items/${request.requestedItem._id}`}
                                  className="font-bold text-green-600 hover:underline"
                                >
                                  {request.requestedItem.title} ({request.requestedItem.points} pts)
                                </Link>
                              </div>
                            </div>

                            {request.swapType === "direct" && request.offeredItem && (
                              <div className="mb-4 pl-12">
                                <p className="text-sm text-gray-600">They are offering their:</p>
                                <Link
                                  href={`/items/${request.offeredItem._id}`}
                                  className="font-bold text-blue-600 hover:underline"
                                >
                                  {request.offeredItem.title} ({request.offeredItem.points} pts)
                                </Link>
                              </div>
                            )}

                            {request.pointsDifference > 0 && (
                              <div className="mb-4 pl-12 text-sm text-orange-600">
                                Additional points: {request.pointsDifference} pts
                              </div>
                            )}

                            {request.message && (
                              <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                                <p className="font-medium">Message:</p>
                                <p>{request.message}</p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAcceptSwap(request._id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept Swap
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="destructive">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Swap Request</DialogTitle>
                                    <DialogDescription>
                                      Provide a reason for rejecting the swap request for "{request.requestedItem.title}
                                      ".
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-2">
                                    <Label htmlFor="reject-reason">Reason</Label>
                                    <Textarea id="reject-reason" placeholder="e.g., Item condition, points mismatch" />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleRejectSwap(request._id, "User provided reason")}
                                    >
                                      Reject Swap
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Sent Swap Requests</CardTitle>
                <CardDescription>Track the status of your outgoing swap requests.</CardDescription>
              </CardHeader>
              <CardContent>
                {swapRequests.filter((req) => req?.requester.toString() == userProfile.id).length === 0 ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't sent any swap requests yet.</p>
                    <Button asChild>
                      <Link href="/browse">Browse Items to Swap</Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requested Item</TableHead>
                        <TableHead>Offered Item/Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Sent</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {swapRequests
                        .filter((req) => req?.requester.toString() == userProfile.id)
                        .map((request) => (
                          <TableRow key={request._id}>
                            <TableCell className="font-medium">
                              <Link href={`/items/${request.requestedItem._id}`} className="hover:underline">
                                {request.requestedItem.title} ({request.requestedItem.points} pts)
                              </Link>
                            </TableCell>
                            <TableCell>
                              {request.swapType === "direct" && request.offeredItem ? (
                                <Link href={`/items/${request.offeredItem._id}`} className="hover:underline">
                                  {request.offeredItem.title} ({request.offeredItem.points} pts)
                                </Link>
                              ) : (
                                `${request.pointsDifference} pts`
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  request.status === "pending"
                                    ? "secondary"
                                    : request.status === "accepted"
                                      ? "default"
                                      : "destructive"
                                }
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {request.status === "pending" && (
                                <Button variant="outline" size="sm">
                                  Cancel
                                </Button>
                              )}
                              {request.status === "accepted" && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/swaps/${request._id}`}>View Swap</Link>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="points-history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Points History</CardTitle>
                <CardDescription>A detailed log of all your points transactions.</CardDescription>
              </CardHeader>
              <CardContent>
                {pointsHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No points transactions yet.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Related Item</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pointsHistory.map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.type === "earned" || transaction.type === "bonus" ? "default" : "secondary"
                              }
                              className={
                                transaction.type === "earned" || transaction.type === "bonus"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }
                            >
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                            {transaction.amount > 0 ? "+" : ""}
                            {transaction.amount} pts
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            {transaction.relatedItem ? (
                              <Link href={`/items/${transaction.relatedItem._id}`} className="hover:underline">
                                {transaction.relatedItem.title}
                              </Link>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
