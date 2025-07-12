import type { Metadata } from 'next'
import './globals.css'

const keywords = [
  "rewear",
  "sustainable fashion",
  "clothing exchange",
  "swap clothes",
  "eco-friendly fashion",
  "secondhand clothing",
  "fashion marketplace",
  "community fashion",
  "sustainable clothing",
  "clothing swaps",
  "recycle fashion",
  "upcycled clothing",
  "fashion sustainability",
  "ethical fashion",
  "fashion sharing",
  "circular fashion",
  "fashion reuse",
  "clothing donation",
  "fashion community",
  "fashion trade",
  "fashion collaboration",
  "fashion innovation",
  "fashion technology",
  "fashion startups",
  "fashion trends",
  "fashion events",
  "fashion workshops",
  "fashion education",
  "fashion awareness",
]

const authors = [
  { 
    name: "Rohit Solanki", 
    url: "https://github.com/Rohit-Solanki-6105"
  },
  { 
    name: "Dishant Dyavarchetti", 
    url: "https://github.com/Dishant-dyavarchetti"
  },
  { 
    name: "Parsva Modi", 
    url: "https://github.com/modiparshva"
  },
]

export const metadata: Metadata = {
  title: 'ReWear',
  description: 'Created with RDP3389 Group',
  keywords: keywords,
  authors: authors,
  creator: "RDP3389 Group",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
