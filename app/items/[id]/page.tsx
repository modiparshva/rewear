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
import { UserProfile } from "@/lib/interfaces"

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
  condition: string,
  status?: string
}

export default function ItemDetailPage() {
  const params = useParams()
  const [item, setItem] = useState<Item | null>(null)
  const [userItems, setUserItems] = useState<UserItem[]>([]) // Items owned by the current logged-in user
  const [loading, setLoading] = useState(true)

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [swapType, setSwapType] = useState<"direct" | "points">("direct")
  const [selectedUserItem, setSelectedUserItem] = useState("")
  const [swapMessage, setSwapMessage] = useState("")
  const [pointsDifference, setPointsDifference] = useState(0)
  const [currentUserPoints, setCurrentUserPoints] = useState(0) // Mock current user points

  // Mock current user ID for demonstration. In a real app, this would come from session/auth context.
  const currentUserId = userProfile?.id // Replace with actual user ID from session

  useEffect(() => {
    if (params.id) {
      fetchUserProfile() // Fetch user profile first
      fetchItem()
      fetchUserItems() // Fetch items for the current user
      setCurrentUserPoints(userProfile?.points || 100)
      
    }
  }, [params.id])

  useEffect(() => {
    calculateSwapCost()
  }, [swapType, selectedUserItem, item])

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
    }
  }

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
    } 
  }

  const fetchUserItems = async () => {
    try {
      // In a real application, you would fetch items owned by the currentUserId
      const response = await fetch("/api/user/items", {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      })
      if (!response.ok) {
        throw new Error("Failed to fetch user items")
      }
      const data = await response.json()
      const avaliableItems = data.items.filter((item: UserItem) => item?.status == "approved")
      setUserItems(avaliableItems || [])
      
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

  useEffect(() => {
    setLoading(false)
  }, [item, userProfile, userItems])

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
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/browse">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Browse
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Image
              src={item.images[selectedImage] || "/placeholder.svg"}
              alt={item.title}
              width={500}
              height={500}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="grid grid-cols-4 gap-2">
              {item.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`img-${idx}`}
                  width={80}
                  height={80}
                  className={`cursor-pointer rounded ${selectedImage === idx ? "ring-2 ring-green-600" : ""
                    }`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <Badge className="bg-green-600 text-lg px-3 py-1">{item.points} pts</Badge>
              </div>
              <p className="text-gray-600 text-lg mb-4">{item.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Category</p><p>{item.category}</p></div>
                <div><p className="text-sm text-gray-500">Type</p><p>{item.type}</p></div>
                <div><p className="text-sm text-gray-500">Size</p><p>{item.size}</p></div>
                <div><p className="text-sm text-gray-500">Condition</p><Badge variant="outline">{item.condition}</Badge></div>
              </div>
              {item.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Tags</p>
                  <div className="flex gap-2 flex-wrap">
                    {item.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <Avatar>
                  <AvatarImage src={item.owner.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.owner.name}</p>
                  <p className="text-sm text-gray-500 flex gap-2 items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {item.owner.rating.toFixed(1)} • {item.owner.totalSwaps} swaps
                  </p>
                </div>
              </div>
              {item.owner.location && (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {item.owner.location.city}, {item.owner.location.state}
                </div>
              )}
            </div>

            <Separator />

            <div className="flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1"><Eye className="h-4 w-4" />{item.views} views</div>
              <div className="flex items-center gap-1"><Heart className="h-4 w-4" />{item.likes.length} likes</div>
              <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(item.createdAt).toLocaleDateString()}</div>
            </div>

            {/* Swap Dialog */}
            {item.status === "swapped" ? (
              <Button size="lg" className="w-full bg-gray-400 text-black cursor-not-allowed" disabled>
                <Recycle className="h-5 w-5 mr-2" />Item Swapped
              </Button>) :
              (
                <Dialog>
                  <DialogTrigger asChild>

                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                      <RefreshCw className="h-5 w-5 mr-2" />Request Swap
                    </Button>


                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Request Swap</DialogTitle>
                      <DialogDescription>Choose how you want to swap for "{item.title}"</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label>Swap Type</Label>
                        <Select value={swapType} onValueChange={(val: "direct" | "points") => setSwapType(val)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="direct">Direct Swap</SelectItem>
                            <SelectItem value="points">Points Swap</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {swapType === "direct" && (
                        <div>
                          <Label>Your Item to Offer</Label>
                          <Select value={selectedUserItem} onValueChange={setSelectedUserItem}>
                            <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
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
                        <Label>Message (optional)</Label>
                        <Textarea value={swapMessage} onChange={(e) => setSwapMessage(e.target.value)} />
                      </div>

                      {pointsDifference > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800">
                          <Coins className="h-4 w-4 inline mr-1" /> Additional cost: {pointsDifference} points
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
              )}
              
          </div>
        </div>
      </div>
    </div>
  )
}
