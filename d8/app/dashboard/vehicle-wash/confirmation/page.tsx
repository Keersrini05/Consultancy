"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface AppointmentDetails {
  name: string
  email: string
  phone: string
  vehicleType: string
  vehicleModel: string
  servicePackage: string
  date: string
  time: string
  duration: number
  price: number
}

export default function ConfirmationPage() {
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null)

  useEffect(() => {
    const storedDetails = localStorage.getItem("appointmentDetails")
    if (storedDetails) {
      try {
        setAppointmentDetails(JSON.parse(storedDetails))
      } catch (e) {
        console.error("Error parsing appointment details:", e)
      }
    }
  }, [])

  return (
    <div className="container py-10 flex flex-col items-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Thank you for booking an appointment with us. Your vehicle wash appointment has been confirmed.</p>

          {appointmentDetails && (
            <div className="bg-muted p-4 rounded-md text-left space-y-2">
              <p className="font-medium text-lg">Appointment Details:</p>
              <p>
                <span className="font-medium">Name:</span> {appointmentDetails.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {appointmentDetails.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {appointmentDetails.phone}
              </p>
              <p>
                <span className="font-medium">Vehicle:</span> {appointmentDetails.vehicleType} (
                {appointmentDetails.vehicleModel})
              </p>
              <p>
                <span className="font-medium">Service:</span> {appointmentDetails.servicePackage}
              </p>
              <p>
                <span className="font-medium">Date:</span> {appointmentDetails.date}
              </p>
              <p>
                <span className="font-medium">Time:</span> {appointmentDetails.time}
              </p>
              <p>
                <span className="font-medium">Duration:</span> {appointmentDetails.duration} minutes
              </p>
              <p>
                <span className="font-medium">Price:</span> ₹{appointmentDetails.price}
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address from keerthanasrinivasansarala@gmail.com
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
