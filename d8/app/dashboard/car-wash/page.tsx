"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function CarWashPage() {
  const router = useRouter()
  const { toast } = useToast()

  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Car Wash Service</h1>
        <p className="text-muted-foreground mb-4">
          Our state-of-the-art car wash facility offers comprehensive cleaning services for all types of vehicles. We
          use eco-friendly cleaning products and advanced equipment to ensure your vehicle looks spotless.
        </p>
        <p className="text-muted-foreground mb-4">
          Our services include exterior washing, interior vacuuming, dashboard cleaning, tire shining, and more. We take
          pride in our attention to detail and commitment to customer satisfaction.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Wash</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Exterior Wash</li>
                <li>Tire Cleaning</li>
                <li>Windows Cleaning</li>
              </ul>
              <p className="font-bold text-xl mt-4">₹299</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/dashboard/car-wash/appointment")}>
                Book Appointment
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Premium Wash</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Everything in Basic Wash</li>
                <li>Interior Vacuuming</li>
                <li>Dashboard Cleaning</li>
                <li>Door Jambs Cleaning</li>
              </ul>
              <p className="font-bold text-xl mt-4">₹499</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/dashboard/car-wash/appointment")}>
                Book Appointment
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Deluxe Wash</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Everything in Premium Wash</li>
                <li>Waxing</li>
                <li>Leather Treatment</li>
                <li>Engine Bay Cleaning</li>
                <li>Headlight Restoration</li>
              </ul>
              <p className="font-bold text-xl mt-4">₹999</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/dashboard/car-wash/appointment")}>
                Book Appointment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
