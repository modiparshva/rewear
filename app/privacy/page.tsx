"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle } from "lucide-react"

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Effective date: January 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ReWear (“we”, “us”, or “our”) respects your privacy and is committed to protecting it through this
                Privacy Policy. This document explains what data we collect, why we collect it, and how we use and
                protect it.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal details such as name, email, and location</li>
                <li>Item listings and swap history</li>
                <li>Messages between users</li>
                <li>Browser/device information for analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To operate and maintain the platform</li>
                <li>To personalize your experience</li>
                <li>To send transactional notifications</li>
                <li>To improve services through analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Sharing of Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We do not sell or rent your personal data. We may share your data with third-party service providers
                that help us run our platform, or when legally required to comply with law enforcement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement security measures such as encryption, secure storage, and access controls to protect your
                information from unauthorized access and misuse.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We retain your information as long as your account is active or as needed to provide our services. You
                may request deletion of your account and data at any time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your data</li>
                <li>Update or correct your information</li>
                <li>Delete your data</li>
                <li>Opt-out of communications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Children’s Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our platform is not intended for children under 13. We do not knowingly collect information from
                children under 13. If we become aware of such data, we will delete it.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may update this Privacy Policy from time to time. If we make significant changes, we’ll notify you by
                email or on the platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>If you have any questions or concerns about our Privacy Policy, please contact us:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Email:</strong> privacy@rewear.com
                </p>
                <p>
                  <strong>Address:</strong> ReWear Privacy Department, 123 Sustainable Street, Green City, GC 12345
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 987-6543
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            By using ReWear, you agree to the terms of this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
