import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/dashboard/coconut-oil">
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video relative">
              <Image src="/placeholder.svg?height=300&width=600" alt="Coconut Oil Mill" fill className="object-cover" />
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-center">Coconut Oil Mill</h2>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/vehicle-wash">
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video relative">
              <Image src="/placeholder.svg?height=300&width=600" alt="Vehicle Wash" fill className="object-cover" />
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-center">Vehicle Wash</h2>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
