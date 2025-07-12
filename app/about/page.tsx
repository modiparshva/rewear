"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recycle, Heart, Users, Leaf, Target, Award, Globe, TrendingUp } from "lucide-react"

const stats = [
  { icon: Users, label: "Active Users", value: "10,000+", color: "text-blue-600" },
  { icon: Recycle, label: "Items Swapped", value: "25,000+", color: "text-green-600" },
  { icon: Leaf, label: "CO2 Saved", value: "500 tons", color: "text-emerald-600" },
  { icon: Globe, label: "Countries", value: "15+", color: "text-purple-600" },
]

const team = [
  {
    name: "Parshva Modi",
    role: "Full Stack Developer",
    image: "https://avatars.githubusercontent.com/u/148650895?s=96&v=4",
  },
  {
    name: "Rohit Solanki",
    role: "Full Stack Developer",
    image: "https://avatars.githubusercontent.com/u/131529487?v=4",
  },
  {
    name: "Dishant Dyvarchetti",
    role: "Full Stack Developer",
    image: "/dishu.png",
  },
]

const values = [
  {
    icon: Heart,
    title: "Sustainability First",
    description: "Every decision we make prioritizes environmental impact and sustainable practices.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Our platform is built by and for our community of conscious fashion enthusiasts.",
  },
  {
    icon: Target,
    title: "Fair & Transparent",
    description: "Our points system ensures fair exchanges and transparent value for all users.",
  },
  {
    icon: Award,
    title: "Quality Focused",
    description: "We maintain high standards through careful curation and community feedback.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About ReWear</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're on a mission to revolutionize fashion consumption by making clothing swaps accessible, fair, and fun
            for everyone. Join us in creating a more sustainable future.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                  To create a world where fashion is circular, sustainable, and accessible to all. We believe that by
                  connecting people who want to share their clothes, we can reduce waste, save money, and build stronger
                  communities.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ReWear was born from a simple observation: most of us have clothes we no longer wear, while constantly
                  wanting something new. The traditional fashion industry's fast-fashion model creates enormous waste
                  and environmental damage.
                </p>
                <p>
                  We realized that technology could solve this problem by connecting people who want to exchange clothes
                  directly. Our points-based system ensures fair trades without the complexity of monetary transactions.
                </p>
                <p>
                  Since launching in 2023, we've helped thousands of people refresh their wardrobes sustainably while
                  building a community of conscious consumers who care about the planet's future.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="ReWear community"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <value.icon className="h-6 w-6 text-green-600" />
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-16">
          <Card className="bg-gray-900 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Our Environmental Impact</h2>
                <p className="text-lg opacity-90 max-w-3xl mx-auto">
                  Every swap on ReWear contributes to a more sustainable future. Here's how we're making a difference:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-xl font-semibold mb-2">Waste Reduction</h3>
                  <p className="opacity-90">
                    Every item swapped prevents textile waste and extends clothing lifecycles
                  </p>
                </div>
                <div className="text-center">
                  <Leaf className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-xl font-semibold mb-2">Carbon Footprint</h3>
                  <p className="opacity-90">Swapping reduces the need for new clothing production and transportation</p>
                </div>
                <div className="text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-xl font-semibold mb-2">Global Community</h3>
                  <p className="opacity-90">Building awareness about sustainable fashion practices worldwide</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-green-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-xl mb-8 opacity-90">
                Be part of the sustainable fashion revolution. Start swapping today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-green-600 bg-transparent"
                  asChild
                >
                  <Link href="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
