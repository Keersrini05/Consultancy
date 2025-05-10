"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { VehicleWashAppointment } from "@/lib/models"

export default function VehicleWashAppointmentsPage() {
  const [appointments, setAppointments] = useState<VehicleWashAppointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch("/api/appointments")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Fetched appointments:", data)
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
        // For demo purposes, use mock data if API fails
        setAppointments([
          {
            _id: "1",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "9876543211",
            vehicleType: "car",
            vehicleModel: "Sedan",
            servicePackage: "premium",
            date: "2023-05-15",
            time: "10:00 AM",
            duration: 45,
            price: 499,
            status: "Scheduled",
            createdAt: new Date(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  if (isLoading) {
    return <div className="container py-10">Loading appointments...</div>
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Vehicle Wash Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableCaption>A list of all vehicle wash appointments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead>Vehicle Model</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment._id?.toString()}>
                  <TableCell className="font-medium">{appointment.name}</TableCell>
                  <TableCell>{appointment.email}</TableCell>
                  <TableCell>{appointment.phone}</TableCell>
                  <TableCell>{appointment.vehicleType}</TableCell>
                  <TableCell>{appointment.vehicleModel}</TableCell>
                  <TableCell>{appointment.servicePackage}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.duration} min</TableCell>
                  <TableCell>₹{appointment.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.status === "Completed"
                          ? "default"
                          : appointment.status === "Scheduled"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
