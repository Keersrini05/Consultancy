import Link from "next/link"
import Image from "next/image"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="Sri Ragavendre Agro Industries Logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="hidden font-bold sm:inline-block">Sri Ragavendre Agro Industries</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span className="text-sm">+91 9876543210</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Logout</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
