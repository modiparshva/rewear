"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Recycle, ImageIcon, Info } from "lucide-react"
import { toast } from "sonner"

export default function NewItemPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [type, setType] = useState("")
  const [size, setSize] = useState("")
  const [condition, setCondition] = useState("")
  const [tags, setTags] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const categories = [
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
  const conditions = ["like-new", "excellent", "very-good", "good", "fair"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const newImages: string[] = []
      filesArray.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newImages.push(reader.result as string)
          if (newImages.length === filesArray.length) {
            setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5)) // Limit to 5 images
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const itemData = {
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      images,
    }

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies with request
        body: JSON.stringify(itemData),
      })

      if (response.ok) {
        toast.success("Item submitted for review! It will appear in the marketplace once approved.")
        // Clear form
        setTitle("")
        setDescription("")
        setCategory("")
        setType("")
        setSize("")
        setCondition("")
        setTags("")
        setImages([])
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to submit item.")
      }
    } catch (error) {
      console.error("Error submitting item:", error)
      toast.error("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
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
            <Link href="/items/new" className="text-green-600 font-medium">
              List Item
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">List a New Item</CardTitle>
            <CardDescription>Fill out the details below to list your clothing item for swap.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Vintage Denim Jacket"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item in detail: brand, material, unique features, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type (e.g., Shirt, Dress)</Label>
                  <Input
                    id="type"
                    placeholder="e.g., T-Shirt"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select value={size} onValueChange={setSize} required>
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={condition} onValueChange={setCondition} required>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((cond) => (
                        <SelectItem key={cond} value={cond}>
                          {cond.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., vintage, streetwear, summer"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Item Images (up to 5)</Label>
                <Input id="images" type="file" multiple accept="image/*" onChange={handleImageUpload} />
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((imgSrc, index) => (
                    <img
                      key={index}
                      src={imgSrc || "/placeholder.svg"}
                      alt={`Item image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                  {images.length === 0 && (
                    <div className="w-24 h-24 border border-dashed rounded flex items-center justify-center text-gray-400">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                {images.length > 5 && <p className="text-sm text-red-500">You can upload a maximum of 5 images.</p>}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>Your item will be reviewed by an admin before appearing in the marketplace.</span>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Submitting..." : "List Item for Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
