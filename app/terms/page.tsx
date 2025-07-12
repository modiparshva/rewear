"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle } from "lucide-react"

export default function TermsPage() {
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing and using ReWear ("the Platform"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms and Conditions govern your use of the ReWear platform, including all content, services, and
                products available at or through the platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ReWear is a clothing exchange platform that allows users to swap, trade, or exchange clothing items
                using a points-based system. The platform facilitates connections between users but does not own, sell,
                or distribute the items being exchanged.
              </p>
              <p>Our service includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Item listing and browsing functionality</li>
                <li>Points-based exchange system</li>
                <li>User communication tools</li>
                <li>Quality assurance through admin review</li>
                <li>Community features and user ratings</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts and Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>To use certain features of the Platform, you must register for an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your information to keep it accurate and current</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Points System and Exchanges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>ReWear operates on a points-based system where:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Points are earned by listing approved items and completing successful swaps</li>
                <li>Points can be used to request items from other users</li>
                <li>Item values are determined by condition and category</li>
                <li>Points have no monetary value and cannot be exchanged for cash</li>
                <li>Points may expire if accounts remain inactive for extended periods</li>
              </ul>
              <p>
                All exchanges are final once completed. ReWear reserves the right to adjust point values and system
                mechanics with reasonable notice to users.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Item Listings and Quality Standards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>When listing items, users must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate descriptions and photos of items</li>
                <li>Ensure items are clean and in the condition described</li>
                <li>Only list items they legally own and have the right to transfer</li>
                <li>Not list counterfeit, stolen, or prohibited items</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              <p>
                ReWear reserves the right to remove listings that don't meet our quality standards or violate these
                terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You may not use the Platform to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any local, state, national, or international law</li>
                <li>Transmit or procure sending of advertising or promotional material without consent</li>
                <li>Impersonate or attempt to impersonate another user or person</li>
                <li>Engage in any fraudulent or deceptive practices</li>
                <li>Upload viruses or other malicious code</li>
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Use the Platform for commercial purposes without authorization</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                information when you use our Platform. By using ReWear, you agree to the collection and use of
                information in accordance with our Privacy Policy.
              </p>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>ReWear acts as a platform connecting users and is not responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The quality, safety, or legality of items listed</li>
                <li>The accuracy of listings or user representations</li>
                <li>The ability of users to complete transactions</li>
                <li>Any disputes between users</li>
                <li>Loss or damage to items during shipping or exchange</li>
              </ul>
              <p>
                In no event shall ReWear be liable for any indirect, incidental, special, consequential, or punitive
                damages arising out of your use of the Platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may terminate or suspend your account and access to the Platform immediately, without prior notice or
                liability, for any reason, including if you breach these Terms and Conditions.
              </p>
              <p>
                Upon termination, your right to use the Platform will cease immediately. All provisions of these Terms
                which should survive termination shall survive, including ownership provisions, warranty disclaimers,
                and limitations of liability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p>Your continued use of the Platform after any changes constitutes acceptance of those changes.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Email:</strong> legal@rewear.com
                </p>
                <p>
                  <strong>Address:</strong> ReWear Legal Department, 123 Sustainable Street, Green City, GC 12345
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            By using ReWear, you acknowledge that you have read and understood these Terms and Conditions and agree to
            be bound by them.
          </p>
        </div>
      </div>
    </div>
  )
}
