"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Heart, MapPin, Star, Eye, Calendar, ArrowLeft, RefreshCw, Coins, Recycle } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Item {
  _id: string
  title: string
  description: string
  category: string
  type: string
  size: string
  condition: string
  points: number
  tags: string[]
  images: string[]
  status: string
  owner: {
    _id: string
    name: string
    avatar?: string
    rating: number
    totalSwaps: number
    location?: {
      city: string
      state: string
      country: string
    }
  }
  views: number
  likes: string[]
  createdAt: string
}

interface UserItem {
  _id: string
  title: string
  points: number
  images: string[]
  condition: string
}

export default function ItemDetailPage() {
  const params = useParams()
  const [item, setItem] = useState<Item | null>(null)
  const [userItems, setUserItems] = useState<UserItem[]>([]) // Items owned by the current logged-in user
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [swapType, setSwapType] = useState<"direct" | "points">("direct")
  const [selectedUserItem, setSelectedUserItem] = useState("")
  const [swapMessage, setSwapMessage] = useState("")
  const [pointsDifference, setPointsDifference] = useState(0)
  const [currentUserPoints, setCurrentUserPoints] = useState(0) // Mock current user points

  // Mock current user ID for demonstration. In a real app, this would come from session/auth context.
  const currentUserId = "user123" // Replace with actual user ID from session

  useEffect(() => {
    if (params.id) {
      fetchItem()
      fetchUserItems() // Fetch items for the current user
      // Mock current user points for demonstration
      setCurrentUserPoints(125)
    }
  }, [params.id])

  useEffect(() => {
    calculateSwapCost()
  }, [swapType, selectedUserItem, item])

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/items/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setItem(data.item)
      } else {
        toast.error("Item not found")
      }
    } catch (error) {
      console.error("Error fetching item:", error)
      toast.error("Failed to load item")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserItems = async () => {
    try {
      // In a real application, you would fetch items owned by the currentUserId
      // For now, using mock data
      setUserItems([
        {
          _id: "65f7d8e9f0a1b2c3d4e5f6a7", // Example ID
          title: "Blue Denim Jacket",
          points: 35,
          images: ["/placeholder.svg?height=100&width=100"],
          condition: "excellent",
        },
        {
          _id: "65f7d8e9f0a1b2c3d4e5f6a8", // Example ID
          title: "White Cotton T-Shirt",
          points: 20,
          images: ["/placeholder.svg?height=100&width=100"],
          condition: "very-good",
        },
      ])
    } catch (error) {
      console.error("Error fetching user items:", error)
    }
  }

  const calculateSwapCost = async () => {
    if (!item) return

    try {
      const response = await fetch("/api/swaps/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedItemId: item._id,
          offeredItemId: swapType === "direct" ? selectedUserItem : null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPointsDifference(data.pointsDifference)
      } else {
        console.error("Failed to calculate swap cost")
        setPointsDifference(item.points) // Default to full item points if calculation fails
      }
    } catch (error) {
      console.error("Error calculating swap cost:", error)
      setPointsDifference(item.points) // Default to full item points on error
    }
  }

  const handleSwapRequest = async () => {
    try {
      const swapData = {
        requestedItem: item?._id,
        swapType,
        offeredItem: swapType === "direct" ? selectedUserItem : undefined,
        message: swapMessage,
      }

      const response = await fetch("/api/swaps/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies with request
        body: JSON.stringify(swapData),
      })

      if (response.ok) {
        toast.success("Swap request sent successfully!")
        setSwapMessage("")
        setSelectedUserItem("")
        // Optionally, update current user's points or item status here
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to send swap request")
      }
    } catch (error) {
      console.error("Error sending swap request:", error)
      toast.error("Failed to send swap request")
    }
  }

  const canAffordSwap = swapType === "direct" || currentUserPoints >= pointsDifference

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Loading item details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Item not found</h3>
            <p className="text-gray-600 mb-4">The item you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/browse">Browse Items</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">ReWear</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-gray-600 hover:text-gray-900">
              Browse
            </Link>
            <Link href="/items/new" className="text-gray-600 hover:text-gray-900">
              List Item
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/browse">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={item.images[selectedImage] || "/placeholder.svg?height=500&width=500"}
                alt={item.title}
                width={500}
                height={500}
                className="w-full h-96 object-cover rounded-lg"
              />
              <Button size="sm" variant="ghost" className="absolute top-4 right-4 bg-white/80 hover:bg-white">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden ${
                      selectedImage === index ? "ring-2 ring-green-600" : ""
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${item.title} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <Badge className="bg-green-600 text-lg px-3 py-1">{item.points} points</Badge>
              </div>

              <p className="text-gray-600 text-lg mb-6">{item.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-gray-900">{item.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-gray-900">{item.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Size</p>
                  <p className="text-gray-900">{item.size}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Condition</p>
                  <Badge variant="outline">{item.condition}</Badge>
                </div>
              </div>

              {item.tags.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Owner Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={item.owner.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.owner.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.owner.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{item.owner.totalSwaps} swaps</span>
                  </div>
                </div>
              </div>

              {item.owner.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {item.owner.location.city}, {item.owner.location.state}
                </div>
              )}
            </div>

            <Separator />

            {/* Item Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{item.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{item.likes.length} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Swap Actions */}
            <div className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Request Swap
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Request Swap</DialogTitle>
                    <DialogDescription>Choose how you'd like to swap for "{item.title}"</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Swap Type</Label>
                      <Select value={swapType} onValueChange={(value: "direct" | "points") => setSwapType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">Direct Swap (Item for Item)</SelectItem>
                          <SelectItem value="points">Points Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {swapType === "direct" && (
                      <div>
                        <Label>Your Item to Offer</Label>
                        <Select value={selectedUserItem} onValueChange={setSelectedUserItem}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an item to offer" />
                          </SelectTrigger>
                          <SelectContent>
                            {userItems.map((userItem) => (
                              <SelectItem key={userItem._id} value={userItem._id}>
                                {userItem.title} ({userItem.points} pts)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label>Message (Optional)</Label>
                      <Textarea
                        placeholder="Add a personal message..."
                        value={swapMessage}
                        onChange={(e) => setSwapMessage(e.target.value)}
                      />
                    </div>

                    {pointsDifference > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <Coins className="h-4 w-4" />
                          <span className="font-medium">Additional cost: {pointsDifference} points</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                          {swapType === "points"
                            ? "You'll spend your points to get this item"
                            : "Points difference between items"}
                        </p>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={handleSwapRequest}
                      disabled={
                        (swapType === "direct" && !selectedUserItem) ||
                        (swapType === "points" && currentUserPoints < pointsDifference)
                      }
                      className="w-full"
                    >
                      Send Swap Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {!canAffordSwap && swapType === "points" && (
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-700 mb-2">
                    You need {pointsDifference - currentUserPoints} more points for this swap
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/browse">
                      <Coins className="h-4 w-4 mr-2" />
                      Browse Items to Earn Points
                    </Link>
                  </Button>
                </div>
              )}

              <Button variant="outline" size="lg" className="w-full bg-transparent">
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
