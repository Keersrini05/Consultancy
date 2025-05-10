import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { VehicleWashAppointment } from "@/lib/models"
import { sendAppointmentConfirmationEmail } from "@/lib/email"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    console.log("Fetching appointments from MongoDB...")
    const db = await getDatabase()

    const appointments = await db.collection("appointments").find({}).sort({ createdAt: -1 }).toArray()
    console.log(`Found ${appointments.length} appointments`)

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments", details: String(error) }, { status: 500 })
  }
}

// Helper function to check for appointment conflicts
async function checkForConflicts(db, date, time, duration) {
  try {
    // Parse the time string to get hours and minutes
    const [timeComponent, period] = time.split(" ")
    const [hourStr, minuteStr] = timeComponent.split(":")

    let hour = Number.parseInt(hourStr)
    const minute = Number.parseInt(minuteStr)

    // Convert to 24-hour format
    if (period === "PM" && hour !== 12) {
      hour += 12
    } else if (period === "AM" && hour === 12) {
      hour = 0
    }

    // Calculate start and end times for the new appointment
    const startTime = new Date(date)
    startTime.setHours(hour, minute, 0, 0)

    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + duration)

    // Find any appointments that overlap with the requested time slot
    const existingAppointments = await db
      .collection("appointments")
      .find({
        date: date,
        status: { $ne: "Cancelled" },
      })
      .toArray()

    // Check for conflicts
    for (const appointment of existingAppointments) {
      // Parse the existing appointment time
      const [existingTimeComponent, existingPeriod] = appointment.time.split(" ")
      const [existingHourStr, existingMinuteStr] = existingTimeComponent.split(":")

      let existingHour = Number.parseInt(existingHourStr)
      const existingMinute = Number.parseInt(existingMinuteStr)

      // Convert to 24-hour format
      if (existingPeriod === "PM" && existingHour !== 12) {
        existingHour += 12
      } else if (existingPeriod === "AM" && existingHour === 12) {
        existingHour = 0
      }

      // Calculate start and end times for the existing appointment
      const existingStartTime = new Date(date)
      existingStartTime.setHours(existingHour, existingMinute, 0, 0)

      const existingEndTime = new Date(existingStartTime)
      existingEndTime.setMinutes(existingEndTime.getMinutes() + appointment.duration)

      // Check if there's an overlap
      if (
        (startTime >= existingStartTime && startTime < existingEndTime) ||
        (endTime > existingStartTime && endTime <= existingEndTime) ||
        (startTime <= existingStartTime && endTime >= existingEndTime)
      ) {
        return {
          conflict: true,
          message: `Time slot conflicts with an existing appointment from ${appointment.time} to ${formatTime(existingEndTime)}`,
          existingAppointment: appointment,
        }
      }
    }

    return { conflict: false }
  } catch (error) {
    console.error("Error checking for conflicts:", error)
    throw error
  }
}

// Helper function to format a Date object to a time string (e.g., "2:30 PM")
function formatTime(date) {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? "0" + minutes : minutes

  return `${hours}:${minutesStr} ${ampm}`
}

export async function POST(request: NextRequest) {
  console.log("POST /api/appointments - Starting")

  try {
    // Parse the request body
    let appointmentData
    try {
      const text = await request.text()
      console.log("Raw request body:", text)

      try {
        appointmentData = JSON.parse(text)
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError)
        return NextResponse.json({ error: "Invalid JSON in request body", details: String(jsonError) }, { status: 400 })
      }

      console.log("Parsed appointment data:", appointmentData)
    } catch (parseError) {
      console.error("Error reading request body:", parseError)
      return NextResponse.json({ error: "Failed to read request body", details: String(parseError) }, { status: 400 })
    }

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "vehicleType",
      "vehicleModel",
      "servicePackage",
      "date",
      "time",
      "duration",
    ]
    const missingFields = requiredFields.filter((field) => !appointmentData[field])

    if (missingFields.length > 0) {
      console.error(`Missing required fields: ${missingFields.join(", ")}`)
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
        },
        { status: 400 },
      )
    }

    try {
      // Connect to MongoDB
      console.log("Connecting to MongoDB...")
      const db = await getDatabase()
      console.log("Connected to MongoDB")

      // Check for appointment conflicts
      const conflictCheck = await checkForConflicts(
        db,
        appointmentData.date,
        appointmentData.time,
        appointmentData.duration,
      )

      if (conflictCheck.conflict) {
        console.log("Appointment conflict detected:", conflictCheck.message)
        return NextResponse.json(
          {
            success: false,
            error: "Appointment conflict",
            message: conflictCheck.message,
            existingAppointment: conflictCheck.existingAppointment,
          },
          { status: 409 },
        ) // 409 Conflict
      }

      // Add creation timestamp and status if not provided
      const appointment: VehicleWashAppointment = {
        ...appointmentData,
        status: appointmentData.status || "Scheduled",
        createdAt: appointmentData.createdAt ? new Date(appointmentData.createdAt) : new Date(),
      }

      // Insert the appointment
      console.log("Inserting appointment into database...")
      const result = await db.collection("appointments").insertOne(appointment)
      console.log("Appointment created with ID:", result.insertedId)

      // Send confirmation email
      if (appointment.email) {
        try {
          console.log("Sending confirmation email...")
          const emailSent = await sendAppointmentConfirmationEmail(appointment)
          console.log("Email sent:", emailSent)
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError)
          // Continue even if email fails
        }
      }

      return NextResponse.json({
        success: true,
        id: result.insertedId,
        message: "Appointment created successfully",
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Database error", details: String(dbError) }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment", details: String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase()

    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 })
    }

    const result = await db
      .collection("appointments")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Appointment updated successfully",
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Failed to update appointment", details: String(error) }, { status: 500 })
  }
}
