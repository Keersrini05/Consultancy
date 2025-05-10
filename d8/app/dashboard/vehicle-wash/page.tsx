"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Define the service packages and their prices for different vehicle types
const servicePackages = {
  bike: {
    basic: {
      name: "Basic Wash",
      price: 150,
      features: ["Exterior Wash", "Tire Cleaning", "Polish"],
      duration: 15, // 15 minutes
    },
    premium: {
      name: "Premium Wash",
      price: 300,
      features: ["Everything in Basic Wash", "Engine Cleaning", "Detailed Polish", "Seat Cleaning"],
      duration: 30, // 30 minutes
    },
  },
  car: {
    basic: {
      name: "Basic Wash",
      price: 299,
      features: ["Exterior Wash", "Tire Cleaning", "Windows Cleaning"],
      duration: 25, // 25 minutes
    },
    premium: {
      name: "Premium Wash",
      price: 499,
      features: ["Everything in Basic Wash", "Interior Vacuuming", "Dashboard Cleaning", "Door Jambs Cleaning"],
      duration: 45, // 45 minutes
    },
    deluxe: {
      name: "Deluxe Wash",
      price: 999,
      features: [
        "Everything in Premium Wash",
        "Waxing",
        "Leather Treatment",
        "Engine Bay Cleaning",
        "Headlight Restoration",
      ],
      duration: 60, // 60 minutes (1 hour)
    },
  },
  bus: {
    basic: {
      name: "Basic Wash",
      price: 1200,
      features: ["Exterior Wash", "Tire Cleaning", "Windows Cleaning"],
      duration: 45, // 45 minutes
    },
    premium: {
      name: "Premium Wash",
      price: 2000,
      features: ["Everything in Basic Wash", "Interior Vacuuming", "Dashboard Cleaning", "Seat Cleaning"],
      duration: 80, // 80 minutes (1 hour 20 minutes)
    },
  },
  lorry: {
    basic: {
      name: "Basic Wash",
      price: 1500,
      features: ["Exterior Wash", "Tire Cleaning", "Windows Cleaning"],
      duration: 45, // 45 minutes
    },
    premium: {
      name: "Premium Wash",
      price: 2500,
      features: ["Everything in Basic Wash", "Interior Vacuuming", "Dashboard Cleaning", "Cargo Area Cleaning"],
      duration: 80, // 80 minutes (1 hour 20 minutes)
    },
  },
}

export default function VehicleWashPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleBookAppointment = (vehicleType: string, packageType: string) => {
    try {
      console.log(`Booking appointment for ${vehicleType}, package: ${packageType}`)

      // Store the selected vehicle and package type for the appointment page
      localStorage.setItem("selectedVehicleType", vehicleType)
      localStorage.setItem("selectedPackageType", packageType)

      // Add a small delay to ensure localStorage is updated
      setTimeout(() => {
        router.push("/dashboard/vehicle-wash/appointment")
      }, 100)
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast({
        title: "Error",
        description: "Failed to proceed to appointment booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Vehicle Wash Service</h1>
        <p className="text-muted-foreground mb-4">
          Our state-of-the-art vehicle wash facility offers comprehensive cleaning services for all types of vehicles.
          We use eco-friendly cleaning products and advanced equipment to ensure your vehicle looks spotless.
        </p>
        <p className="text-muted-foreground mb-4">
          Our services include exterior washing, interior vacuuming, dashboard cleaning, tire shining, and more. We take
          pride in our attention to detail and commitment to customer satisfaction.
        </p>

        <Tabs defaultValue="bike" className="mt-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="bike">Bike</TabsTrigger>
            <TabsTrigger value="car">Car</TabsTrigger>
            <TabsTrigger value="bus">Bus</TabsTrigger>
            <TabsTrigger value="lorry">Lorry</TabsTrigger>
          </TabsList>

          {/* Bike Packages */}
          <TabsContent value="bike">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{servicePackages.bike.basic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {servicePackages.bike.basic.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-xl mt-4">₹{servicePackages.bike.basic.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {servicePackages.bike.basic.duration} minutes
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookAppointment("bike", "basic")}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{servicePackages.bike.premium.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {servicePackages.bike.premium.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-xl mt-4">₹{servicePackages.bike.premium.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {servicePackages.bike.premium.duration} minutes
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookAppointment("bike", "premium")}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Car Packages */}
          <TabsContent value="car">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{servicePackages.car.basic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {servicePackages.car.basic.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-xl mt-4">₹{servicePackages.car.basic.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {servicePackages.car.basic.duration} minutes
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookAppointment("car", "basic")}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{servicePackages.car.premium.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {servicePackages.car.premium.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-xl mt-4">₹{servicePackages.car.premium.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {servicePackages.car.premium.duration} minutes
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookAppointment("car", "premium")}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{servicePackages.car.deluxe.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {servicePackages.car.deluxe.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-xl mt-4">₹{servicePackages.car.deluxe.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {servicePackages.car.deluxe.duration} minutes
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookAppointment("car", "deluxe")}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Bus Packages */}
          <TabsContent value="bus">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{servicePackages.bus.basic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {servicePackages.bus.basic.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-xl mt-4">₹{servicePackages.bus.basic.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {servicePackages.bus.basic.duration} minutes
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookAppointment("bus", "basic")}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{servicePackages.bus.premium.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {servicePackages.bus.premium.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-xl mt-4">₹{servicePackages.bus.premium.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {servicePackages.bus.premium.duration} minutes (1 hour 20 minutes)
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookAppointment("bus", "premium")}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Lorry Packages */}
          <TabsContent value="lorry">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{servicePackages.lorry.basic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {servicePackages.lorry.basic.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-xl mt-4">₹{servicePackages.lorry.basic.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {servicePackages.lorry.basic.duration} minutes
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookAppointment("lorry", "basic")}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{servicePackages.lorry.premium.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {servicePackages.lorry.premium.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-xl mt-4">₹{servicePackages.lorry.premium.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {servicePackages.lorry.premium.duration} minutes (1 hour 20 minutes)
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBookAppointment("lorry", "premium")}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
