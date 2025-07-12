
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

interface Item {
  _id: string
  title: string
  description: string
  category: string
  condition: string
  points: number
  images: string[]
  owner: {
    name: string
    avatar?: string
    rating: number
    totalSwaps: number
    location?: {
      city: string
      state: string
    }
  }
  views: number
  likes: string[]
  createdAt: string
}


export type { UserProfile, UserItem, SwapRequest, PointsTransaction, Item };