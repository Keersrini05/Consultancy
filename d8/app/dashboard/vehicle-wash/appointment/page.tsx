"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, isSunday, isBefore, addMinutes } from "date-fns"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Define package types for better type safety
type BikePackage = "basic" | "premium"
type CarPackage = "basic" | "premium" | "deluxe"
type BusPackage = "basic" | "premium"
type LorryPackage = "basic" | "premium"

type VehicleCategory = "bike" | "car" | "bus" | "lorry"
type PackageType = BikePackage | CarPackage | BusPackage | LorryPackage

// Service packages and their prices for different vehicle types
const servicePackages = {
  bike: {
    basic: {
      name: "Basic Wash",
      price: 150,
      duration: 15, // 15 minutes
    },
    premium: {
      name: "Premium Wash",
      price: 300,
      duration: 30, // 30 minutes
    },
  },
  car: {
    basic: {
      name: "Basic Wash",
      price: 299,
      duration: 25, // 25 minutes
    },
    premium: {
      name: "Premium Wash",
      price: 499,
      duration: 45, // 45 minutes
    },
    deluxe: {
      name: "Deluxe Wash",
      price: 999,
      duration: 60, // 60 minutes (1 hour)
    },
  },
  bus: {
    basic: {
      name: "Basic Wash",
      price: 1200,
      duration: 45, // 45 minutes
    },
    premium: {
      name: "Premium Wash",
      price: 2000,
      duration: 80, // 80 minutes (1 hour 20 minutes)
    },
  },
  lorry: {
    basic: {
      name: "Basic Wash",
      price: 1500,
      duration: 45, // 45 minutes
    },
    premium: {
      name: "Premium Wash",
      price: 2500,
      duration: 80, // 80 minutes (1 hour 20 minutes)
    },
  },
}

// Vehicle type options based on the selected vehicle
const vehicleTypeOptions = {
  bike: ["Standard", "Sports", "Cruiser", "Scooter"],
  car: ["Sedan", "SUV", "Hatchback", "Luxury"],
  bus: ["Mini Bus", "School Bus", "Tourist Bus", "City Bus"],
  lorry: ["Light Duty", "Medium Duty", "Heavy Duty", "Tanker"],
}

// Default package info for fallback
const defaultPackageInfo = {
  name: "Basic Wash",
  price: 0,
  duration: 0,
}

// Helper function to get available packages for a vehicle category
const getAvailablePackages = (category: VehicleCategory): PackageType[] => {
  // Make sure the category is valid
  if (!servicePackages[category]) {
    console.error(`Invalid vehicle category: ${category}`)
    return []
  }

  return Object.keys(servicePackages[category]) as PackageType[]
}

// Helper function to safely get package info
const getPackageInfo = (category: VehicleCategory, packageType: string) => {
  try {
    // Safety check: Make sure category exists in servicePackages
    if (!servicePackages[category]) {
      console.error(`Invalid vehicle category: ${category}`)
      return defaultPackageInfo
    }

    // Safety check: Make sure the package type exists for this category
    const categoryPackages = servicePackages[category] as Record<string, any>
    if (categoryPackages && categoryPackages[packageType]) {
      return categoryPackages[packageType]
    }

    console.error(`Invalid package type: ${packageType} for category: ${category}`)
    return defaultPackageInfo
  } catch (error) {
    console.error("Error getting package info:", error)
    return defaultPackageInfo
  }
}

// Interface for booked appointments
interface BookedAppointment {
  date: string
  time: string
  duration: number
}

export default function AppointmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [vehicleModel, setVehicleModel] = useState<string>("")
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<VehicleCategory>("car")
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availablePackages, setAvailablePackages] = useState<PackageType[]>([])
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [bookedAppointments, setBookedAppointments] = useState<BookedAppointment[]>([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)

  const today = new Date()
  const maxDate = addDays(today, 30)

  // Fetch booked appointments from the server
  useEffect(() => {
    const fetchBookedAppointments = async () => {
      try {
        setIsLoadingAppointments(true)
        const response = await fetch("/api/appointments")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched appointments:", data)

        // Extract relevant appointment data
        const appointments = data.map((appointment: any) => ({
          date: appointment.date,
          time: appointment.time,
          duration: appointment.duration || 30, // Default to 30 minutes if not specified
        }))

        setBookedAppointments(appointments)
      } catch (error) {
        console.error("Error fetching appointments:", error)
        // Use mock data if API fails
        setBookedAppointments([
          { date: "2025-04-19", time: "11:00 AM", duration: 30 },
          { date: "2025-04-19", time: "2:00 PM", duration: 45 },
          { date: "2025-04-20", time: "10:00 AM", duration: 60 },
        ])
      } finally {
        setIsLoadingAppointments(false)
      }
    }

    fetchBookedAppointments()
  }, [])

  // Update available packages when vehicle category changes
  useEffect(() => {
    try {
      if (selectedVehicleCategory) {
        const packages = getAvailablePackages(selectedVehicleCategory)
        setAvailablePackages(packages)

        // Reset selected package if it's not available for the new category
        if (selectedPackage && !packages.includes(selectedPackage as PackageType)) {
          setSelectedPackage("")
        }
      }
    } catch (error) {
      console.error("Error updating available packages:", error)
      setAvailablePackages([])
    }
  }, [selectedVehicleCategory, selectedPackage])

  // Load selected vehicle and package type from localStorage
  useEffect(() => {
    try {
      const storedVehicleType = localStorage.getItem("selectedVehicleType")
      const storedPackageType = localStorage.getItem("selectedPackageType")

      console.log("Retrieved from localStorage:", { storedVehicleType, storedPackageType })

      // Validate the stored vehicle type
      if (storedVehicleType && ["bike", "car", "bus", "lorry"].includes(storedVehicleType)) {
        setSelectedVehicleCategory(storedVehicleType as VehicleCategory)
      } else {
        // Default to car if invalid or missing
        setSelectedVehicleCategory("car")
      }

      if (storedPackageType) {
        setSelectedPackage(storedPackageType)
      }

      // Pre-fill user email if available
      const userEmail = localStorage.getItem("userEmail")
      if (userEmail) {
        setEmail(userEmail)
      }
    } catch (error) {
      console.error("Error retrieving stored values:", error)
      // Default to car if there's an error
      setSelectedVehicleCategory("car")
      toast({
        title: "Error",
        description: "Failed to load selected vehicle and package information.",
        variant: "destructive",
      })
    }
  }, [toast])

  // Generate time slots from 10:00 AM to 5:00 PM with 15-minute intervals
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 10 // 10:00 AM
    const endHour = 17 // 5:00 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour > 12 ? hour - 12 : hour
        const period = hour >= 12 ? "PM" : "AM"
        const formattedMinute = minute === 0 ? "00" : minute
        slots.push(`${formattedHour}:${formattedMinute} ${period}`)
      }
    }

    return slots
  }

  const timeSlots = generateTimeSlots()

  // Helper function to parse time string to hours and minutes
  const parseTimeString = (timeStr: string): { hour: number; minute: number } => {
    const [timeComponent, period] = timeStr.split(" ")
    const [hourStr, minuteStr] = timeComponent.split(":")

    let hour = Number.parseInt(hourStr)
    const minute = Number.parseInt(minuteStr)

    // Convert to 24-hour format
    if (period === "PM" && hour !== 12) {
      hour += 12
    } else if (period === "AM" && hour === 12) {
      hour = 0
    }

    return { hour, minute }
  }

  // Check if a time slot conflicts with existing appointments
  const isTimeSlotConflicting = (selectedDate: Date, selectedTimeStr: string): boolean => {
    if (!selectedDate || !selectedTimeStr || bookedAppointments.length === 0) {
      return false
    }

    try {
      // Format the selected date to match the format in bookedAppointments
      const formattedDate = format(selectedDate, "yyyy-MM-dd")

      // Parse the selected time
      const { hour, minute } = parseTimeString(selectedTimeStr)

      // Create a Date object for the selected date and time
      const selectedDateTime = new Date(selectedDate)
      selectedDateTime.setHours(hour, minute, 0, 0)

      // Get the duration of the selected package
      const duration = getSelectedPackageDuration()

      // Calculate the end time of the selected appointment
      const selectedEndTime = addMinutes(selectedDateTime, duration)

      // Check for conflicts with existing appointments
      for (const appointment of bookedAppointments) {
        // Skip if not the same date
        if (appointment.date !== formattedDate) {
          continue
        }

        // Parse the booked appointment time
        const { hour: bookedHour, minute: bookedMinute } = parseTimeString(appointment.time)

        // Create Date objects for the booked appointment start and end times
        const bookedStartTime = new Date(selectedDate)
        bookedStartTime.setHours(bookedHour, bookedMinute, 0, 0)

        const bookedEndTime = addMinutes(bookedStartTime, appointment.duration)

        // Check if there's an overlap
        // An overlap occurs if the selected start time is before the booked end time
        // AND the selected end time is after the booked start time
        if (selectedDateTime < bookedEndTime && selectedEndTime > bookedStartTime) {
          return true // Conflict detected
        }
      }

      return false // No conflict
    } catch (error) {
      console.error("Error checking time slot conflict:", error)
      return false // Default to no conflict in case of error
    }
  }

  // Get the duration of the selected package
  const getSelectedPackageDuration = () => {
    try {
      if (!selectedVehicleCategory || !selectedPackage) return 0

      const packageInfo = getPackageInfo(selectedVehicleCategory, selectedPackage)
      return packageInfo ? packageInfo.duration : 0
    } catch (error) {
      console.error("Error getting package duration:", error)
      return 0
    }
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!name.trim()) errors.name = "Name is required"
    if (!email.trim()) errors.email = "Email is required"
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email is required"
    if (!phone.trim()) errors.phone = "Phone number is required"
    if (!vehicleModel) errors.vehicleModel = "Vehicle type is required"
    if (!selectedPackage) errors.selectedPackage = "Service package is required"
    if (!date) errors.date = "Date is required"
    if (!time) errors.time = "Time is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      })
      return
    }

    // Check for time slot conflicts
    if (date && time && isTimeSlotConflicting(date, time)) {
      toast({
        title: "Time Slot Conflict",
        description: "This time slot conflicts with an existing appointment. Please select another time.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Get the price and duration based on selected vehicle and package
      const packageInfo = getPackageInfo(selectedVehicleCategory, selectedPackage)

      if (!packageInfo) {
        throw new Error("Invalid package selection")
      }

      const price = packageInfo.price
      const duration = packageInfo.duration

      // Format date as string
      const formattedDate = date ? format(date, "yyyy-MM-dd") : ""

      // Create appointment data
      const appointmentData = {
        name,
        email,
        phone,
        vehicleType: selectedVehicleCategory,
        vehicleModel,
        servicePackage: selectedPackage,
        date: formattedDate,
        time,
        duration,
        price,
        status: "Scheduled",
      }

      console.log("Submitting appointment data:", appointmentData)

      try {
        // Try to save to database via API
        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        })

        // Log the full response for debugging
        console.log("API Response status:", response.status)
        const responseText = await response.text()
        console.log("API Response text:", responseText)

        let result
        try {
          // Try to parse the response as JSON
          result = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Error parsing API response:", parseError)
          // If parsing fails, create a fallback result
          result = { success: false, error: "Invalid API response format" }
        }

        if (result && result.success) {
          // API call succeeded
          console.log("Appointment created successfully:", result)

          // Store appointment details for confirmation page
          const appointmentDetails = {
            ...appointmentData,
            date: date ? format(date, "PPP") : "",
            id: result.id,
          }

          localStorage.setItem("appointmentDetails", JSON.stringify(appointmentDetails))

          toast({
            title: "Appointment Booked",
            description: `Your ${selectedVehicleCategory} wash appointment has been confirmed`,
          })

          // Redirect to confirmation page
          router.push("/dashboard/vehicle-wash/confirmation")
        } else {
          // API call failed but we'll use the fallback
          console.warn("API call failed, using fallback:", result?.error || "Unknown error")

          // Store appointment details locally as fallback
          const appointmentDetails = {
            ...appointmentData,
            date: date ? format(date, "PPP") : "",
            id: "local-" + Date.now(),
          }

          localStorage.setItem("appointmentDetails", JSON.stringify(appointmentDetails))

          toast({
            title: "Appointment Booked",
            description: `Your ${selectedVehicleCategory} wash appointment has been confirmed (offline mode)`,
          })

          // Redirect to confirmation page despite API failure
          router.push("/dashboard/vehicle-wash/confirmation")
        }
      } catch (apiError) {
        // Network error or other API failure
        console.error("API call failed completely:", apiError)

        // Store appointment details locally as fallback
        const appointmentDetails = {
          ...appointmentData,
          date: date ? format(date, "PPP") : "",
          id: "local-" + Date.now(),
        }

        localStorage.setItem("appointmentDetails", JSON.stringify(appointmentDetails))

        toast({
          title: "Appointment Booked",
          description: `Your ${selectedVehicleCategory} wash appointment has been saved locally. Please contact us to confirm.`,
        })

        // Redirect to confirmation page despite API failure
        router.push("/dashboard/vehicle-wash/confirmation")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/vehicle-wash">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vehicle Wash
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Vehicle Wash Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAppointments ? (
            <div className="flex justify-center py-8">
              <p>Loading available appointment slots...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle-category">Vehicle Category</Label>
                <Select
                  value={selectedVehicleCategory}
                  onValueChange={(value: string) => {
                    if (["bike", "car", "bus", "lorry"].includes(value)) {
                      setSelectedVehicleCategory(value as VehicleCategory)
                      setVehicleModel("") // Reset vehicle model when category changes
                      setSelectedPackage("") // Reset package when category changes
                    } else {
                      console.error(`Invalid vehicle category: ${value}`)
                      setSelectedVehicleCategory("car") // Default to car if invalid
                    }
                  }}
                  required
                >
                  <SelectTrigger id="vehicle-category">
                    <SelectValue placeholder="Select vehicle category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">Bike</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="lorry">Lorry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle-type">Vehicle Type</Label>
                <Select value={vehicleModel} onValueChange={setVehicleModel} required>
                  <SelectTrigger id="vehicle-type" className={formErrors.vehicleModel ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(vehicleTypeOptions[selectedVehicleCategory] || []).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.vehicleModel && <p className="text-xs text-red-500">{formErrors.vehicleModel}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="package">Service Package</Label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage} required>
                  <SelectTrigger id="package" className={formErrors.selectedPackage ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select service package" />
                  </SelectTrigger>
                  <SelectContent>
                    {(availablePackages || []).map((pkg) => {
                      try {
                        const packageInfo = getPackageInfo(selectedVehicleCategory, pkg)
                        if (!packageInfo) return null

                        return (
                          <SelectItem key={pkg} value={pkg}>
                            {packageInfo.name} - ₹{packageInfo.price} ({packageInfo.duration} min)
                          </SelectItem>
                        )
                      } catch (error) {
                        console.error(`Error rendering package ${pkg}:`, error)
                        return null
                      }
                    })}
                  </SelectContent>
                </Select>
                {formErrors.selectedPackage && <p className="text-xs text-red-500">{formErrors.selectedPackage}</p>}
              </div>

              <div className="space-y-2">
                <Label>Appointment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        formErrors.date && "border-red-500",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate)
                        // Reset time when date changes
                        setTime(undefined)
                      }}
                      disabled={(date) => isBefore(date, today) || isSunday(date) || isBefore(maxDate, date)}
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.date && <p className="text-xs text-red-500">{formErrors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Appointment Time</Label>
                <Select value={time} onValueChange={setTime} disabled={!date} required>
                  <SelectTrigger id="time" className={formErrors.time ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((timeSlot) => {
                      const isConflicting = date ? isTimeSlotConflicting(date, timeSlot) : false
                      return (
                        <SelectItem key={timeSlot} value={timeSlot} disabled={isConflicting}>
                          {timeSlot} {isConflicting && ""}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {formErrors.time && <p className="text-xs text-red-500">{formErrors.time}</p>}
              </div>

              <Button disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Book Appointment"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
