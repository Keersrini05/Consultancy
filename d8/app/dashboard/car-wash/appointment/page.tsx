"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, isSunday, isBefore } from "date-fns"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Mock data for booked slots
const bookedSlots = [
  new Date(2025, 3, 19, 11, 0), // April 19, 2025, 11:00 AM
  new Date(2025, 3, 19, 14, 0), // April 19, 2025, 2:00 PM
  new Date(2025, 3, 20, 10, 0), // April 20, 2025, 10:00 AM
]

export default function AppointmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [carType, setCarType] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(undefined)

  const today = new Date()
  const maxDate = addDays(today, 30)

  const timeSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ]

  const isDateBooked = (date: Date, timeStr: string) => {
    const [hourStr, minuteStr] = timeStr.split(":")
    const isPM = timeStr.includes("PM")
    let hour = Number.parseInt(hourStr)

    if (isPM && hour !== 12) {
      hour += 12
    } else if (!isPM && hour === 12) {
      hour = 0
    }

    const minute = Number.parseInt(minuteStr)
    const selectedDateTime = new Date(date)
    selectedDateTime.setHours(hour, minute, 0, 0)

    return bookedSlots.some(
      (bookedSlot) =>
        bookedSlot.getFullYear() === selectedDateTime.getFullYear() &&
        bookedSlot.getMonth() === selectedDateTime.getMonth() &&
        bookedSlot.getDate() === selectedDateTime.getDate() &&
        bookedSlot.getHours() === selectedDateTime.getHours(),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !time) {
      toast({
        title: "Error",
        description: "Please select a date and time for your appointment",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would save the appointment to a database
    toast({
      title: "Appointment Booked",
      description: "Your car wash appointment has been confirmed",
    })

    // Send confirmation email (simulated)
    console.log(`Sending confirmation email to ${name} for appointment on ${format(date, "PPP")} at ${time}`)

    // Redirect to confirmation page
    router.push("/dashboard/car-wash/confirmation")
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/car-wash">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Car Wash
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Car Wash Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="car-type">Car Type</Label>
              <Select value={carType} onValueChange={setCarType} required>
                <SelectTrigger id="car-type">
                  <SelectValue placeholder="Select car type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="hatchback">Hatchback</SelectItem>
                  <SelectItem value="luxury">Luxury Car</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => isBefore(date, today) || isSunday(date) || isBefore(maxDate, date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Appointment Time</Label>
              <Select value={time} onValueChange={setTime} disabled={!date} required>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((timeSlot) => {
                    const isBooked = date ? isDateBooked(date, timeSlot) : false
                    return (
                      <SelectItem key={timeSlot} value={timeSlot} disabled={isBooked}>
                        {timeSlot} {isBooked && "(Booked)"}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground mt-2">Each appointment slot is 30 minutes in duration.</div>

            <Button type="submit" className="w-full">
              Book Appointment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
