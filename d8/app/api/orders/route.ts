import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { OilOrder } from "@/lib/models"
import { sendOrderConfirmationEmail } from "@/lib/email"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    console.log("Fetching orders from MongoDB...")
    const db = await getDatabase()

    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray()
    console.log(`Found ${orders.length} orders`)

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("POST /api/orders - Starting")

  try {
    // Parse the request body
    let orderData
    try {
      const text = await request.text()
      console.log("Raw request body:", text)

      try {
        orderData = JSON.parse(text)
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError)
        return NextResponse.json({ error: "Invalid JSON in request body", details: String(jsonError) }, { status: 400 })
      }

      console.log("Parsed order data:", orderData)
    } catch (parseError) {
      console.error("Error reading request body:", parseError)
      return NextResponse.json({ error: "Failed to read request body", details: String(parseError) }, { status: 400 })
    }

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "address", "city", "state", "pincode", "items", "total"]
    const missingFields = requiredFields.filter((field) => !orderData[field])

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

      // Add creation timestamp and status if not provided
      const order: OilOrder = {
        ...orderData,
        status: orderData.status || "Processing",
        createdAt: orderData.createdAt ? new Date(orderData.createdAt) : new Date(),
      }

      // Insert the order
      console.log("Inserting order into database...")
      try {
        const result = await db.collection("orders").insertOne(order)
        console.log("Order created with ID:", result.insertedId)

        // Send confirmation email
        if (order.email) {
          try {
            console.log("Sending confirmation email...")
            const emailSent = await sendOrderConfirmationEmail(order)
            console.log("Email sent:", emailSent)
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError)
            // Continue even if email fails
          }
        }

        return NextResponse.json({
          success: true,
          id: result.insertedId,
          message: "Order created successfully",
        })
      } catch (insertError) {
        console.error("Error inserting order:", insertError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to insert order",
            details: String(insertError),
          },
          { status: 500 },
        )
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          details: String(dbError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected error creating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: String(error),
      },
      { status: 500 },
    )
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
      .collection("orders")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order", details: String(error) }, { status: 500 })
  }
}
