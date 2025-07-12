"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, Search, Filter, Grid, List, MapPin, Star, Recycle } from "lucide-react"
import Image from "next/image"

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

const categories = [
  "All",
  "Tops & T-Shirts",
  "Dresses",
  "Pants & Jeans",
  "Shorts",
  "Skirts",
  "Outerwear",
  "Shoes",
  "Accessories",
  "Activewear",
  "Formal Wear",
]

const conditions = ["All", "like-new", "excellent", "very-good", "good", "fair"]

const sizes = ["All", "XS", "S", "M", "L", "XL", "XXL", "XXXL"]

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "points-low", label: "Points: Low to High" },
  { value: "points-high", label: "Points: High to Low" },
  { value: "alphabetical", label: "Alphabetical" },
]

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [selectedSize, setSelectedSize] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchItems()
  }, [searchTerm, selectedCategory, selectedCondition, selectedSize, sortBy, page])

  const fetchItems = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sortBy,
      })

      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory !== "All") params.append("category", selectedCategory)
      if (selectedCondition !== "All") params.append("condition", selectedCondition)
      if (selectedSize !== "All") params.append("size", selectedSize)

      const response = await fetch(`/api/items?${params}`)

      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
        setTotalPages(data.pagination?.pages || 1)
      } else {
        console.error("Failed to fetch items")
        setItems([])
      }
    } catch (error) {
      console.error("Error fetching items:", error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
    fetchItems()
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setSelectedCondition("All")
    setSelectedSize("All")
    setSortBy("newest")
    setPage(1)
  }

  const ItemCard = ({ item }: { item: Item }) => (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={item.images[0] || "/placeholder.svg?height=200&width=300"}
          alt={item.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Button size="sm" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
          <Heart className="h-4 w-4" />
        </Button>
        <Badge className="absolute bottom-2 left-2 bg-green-600">{item.points} pts</Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Condition</span>
            <Badge variant="outline">{item.condition}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={item.owner.avatar || "/placeholder.svg?height=24&width=24"}
                alt={item.owner.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">{item.owner.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{item.owner.rating.toFixed(1)}</span>
            </div>
          </div>

          {item.owner.location && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              {item.owner.location.city}, {item.owner.location.state}
            </div>
          )}

          <Button asChild className="w-full">
            <Link href={`/items/${item._id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const ItemListCard = ({ item }: { item: Item }) => (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Image
            src={item.images[0] || "/placeholder.svg?height=100&width=100"}
            alt={item.title}
            width={100}
            height={100}
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
              <Badge className="bg-green-600 ml-2">{item.points} pts</Badge>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Condition: {item.condition}</span>
                <span>•</span>
                <span>{item.views} views</span>
              </div>

              <Button asChild size="sm">
                <Link href={`/items/${item._id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
          <p className="text-gray-600">Discover amazing clothes from our community</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex flex-wrap gap-4 items-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition === "All" ? "All Conditions" : condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size === "All" ? "All Sizes" : size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" onClick={resetFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all items</p>
              <Button onClick={resetFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">Showing {items.length} items</p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <ItemListCard key={item._id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}

                <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
