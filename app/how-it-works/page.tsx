"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recycle, Upload, CheckCircle, RefreshCw, Coins, Users, Shield, Heart } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "List Your Items",
    description:
      "Upload photos and details of clothes you no longer wear. Our team reviews each item to ensure quality.",
    points: "+10 points",
    color: "text-blue-600",
  },
  {
    icon: CheckCircle,
    title: "Get Approved",
    description: "Once approved, your items appear in the marketplace and you earn points based on item quality.",
    points: "Earn points",
    color: "text-green-600",
  },
  {
    icon: RefreshCw,
    title: "Browse & Swap",
    description: "Find items you love and request swaps. Exchange directly or use points to get what you want.",
    points: "Use points",
    color: "text-purple-600",
  },
  {
    icon: Coins,
    title: "Earn More Points",
    description: "Complete swaps, maintain good ratings, and refer friends to earn bonus points for future exchanges.",
    points: "+25 bonus",
    color: "text-orange-600",
  },
]

const benefits = [
  {
    icon: Heart,
    title: "Sustainable Fashion",
    description: "Reduce waste by giving clothes a second life instead of throwing them away.",
  },
  {
    icon: Coins,
    title: "Points-Based Economy",
    description: "No money involved - everything works through our fair points system.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Connect with like-minded people who care about sustainable fashion.",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "All items are reviewed by our team to ensure quality and authenticity.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How ReWear Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join the sustainable fashion revolution with our simple points-based clothing exchange platform. No money,
            no hassle - just great clothes finding new homes.
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/signup">Get Started Today</Link>
          </Button>
        </div>

        {/* Steps Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Four Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center ${step.color}`}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600">{step.points}</Badge>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Points System Explanation */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
                <Coins className="h-6 w-6 text-green-600" />
                Understanding Our Points System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Earn Points</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• List quality items: +10 pts</li>
                    <li>• Complete swaps: +5 pts</li>
                    <li>• Good ratings: +5 pts</li>
                    <li>• Refer friends: +25 pts</li>
                  </ul>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Item Values</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Like New: 50 pts</li>
                    <li>• Excellent: 40 pts</li>
                    <li>• Very Good: 30 pts</li>
                    <li>• Good: 20 pts</li>
                    <li>• Fair: 10 pts</li>
                  </ul>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Swap Types</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Direct swap: Item for item</li>
                    <li>• Points swap: Use points only</li>
                    <li>• Mixed: Item + points</li>
                    <li>• Fair value guaranteed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose ReWear?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <benefit.icon className="h-6 w-6 text-green-600" />
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I get started?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simply sign up for a free account, upload photos of clothes you want to swap, and start browsing items
                  from other users. You'll get 100 welcome points to begin!
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there any cost involved?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  No! ReWear is completely free. We use a points-based system instead of money. You earn points by
                  listing items and use them to get items you want.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How are items valued?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Items are automatically valued based on their condition, from 10 points (fair) to 50 points (like
                  new). Our admin team reviews each item to ensure fair pricing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I don't have enough points?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  You can list more items to earn points, complete direct swaps with your existing items, or refer
                  friends to earn bonus points. There are many ways to build your points balance!
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-green-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Swapping?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of users who are already making sustainable fashion choices
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">Create Account</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-green-600 bg-transparent"
                  asChild
                >
                  <Link href="/browse">Browse Items</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
