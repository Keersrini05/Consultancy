import nodemailer from "nodemailer"
import type { VehicleWashAppointment, OilOrder } from "./models"

// Create a transporter with error handling
const createTransporter = () => {
  try {
    if (!process.env.EMAIL_PASSWORD) {
      console.error("EMAIL_PASSWORD environment variable is not set")
      throw new Error("Email password not configured")
    }

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "keerthanasrinivasansarala@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
      // Add timeout options
      connectionTimeout: 10000, // 10 seconds
      socketTimeout: 20000, // 20 seconds
    })
  } catch (error) {
    console.error("Failed to create email transporter:", error)
    throw error
  }
}

export async function sendAppointmentConfirmationEmail(appointment: VehicleWashAppointment) {
  try {
    console.log("Sending appointment confirmation email to:", appointment.email)

    const transporter = createTransporter()

    // Email to customer
    const customerMailOptions = {
      from: "keerthanasrinivasansarala@gmail.com",
      to: appointment.email,
      subject: "Vehicle Wash Appointment Confirmation - Sri Ragavendre Agro Industries",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4CAF50; text-align: center;">Appointment Confirmed!</h2>
          <p>Dear ${appointment.name},</p>
          <p>Thank you for booking an appointment with Sri Ragavendre Agro Industries. Your vehicle wash appointment has been confirmed.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Appointment Details:</h3>
            <p><strong>Vehicle Type:</strong> ${appointment.vehicleType}</p>
            <p><strong>Vehicle Model:</strong> ${appointment.vehicleModel}</p>
            <p><strong>Service Package:</strong> ${appointment.servicePackage}</p>
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Duration:</strong> ${appointment.duration} minutes</p>
            <p><strong>Price:</strong> ₹${appointment.price}</p>
          </div>
          
          <p>If you need to reschedule or cancel your appointment, please contact us at +91 9876543210.</p>
          <p>We look forward to serving you!</p>
          
          <p style="margin-top: 30px;">Best Regards,<br>Sri Ragavendre Agro Industries Team</p>
        </div>
      `,
    }

    // Email to owner
    const ownerMailOptions = {
      from: "noreply@sriragavendreagro.com", // Use a consistent sender
      to: "keerthanasrinivasansarala@gmail.com",
      subject: "New Vehicle Wash Appointment - Sri Ragavendre Agro Industries",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4CAF50; text-align: center;">New Appointment Received!</h2>
          <p>A new vehicle wash appointment has been booked.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Details:</h3>
            <p><strong>Name:</strong> ${appointment.name}</p>
            <p><strong>Email:</strong> ${appointment.email}</p>
            <p><strong>Phone:</strong> ${appointment.phone}</p>
            
            <h3 style="margin-top: 15px;">Appointment Details:</h3>
            <p><strong>Vehicle Type:</strong> ${appointment.vehicleType}</p>
            <p><strong>Vehicle Model:</strong> ${appointment.vehicleModel}</p>
            <p><strong>Service Package:</strong> ${appointment.servicePackage}</p>
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Duration:</strong> ${appointment.duration} minutes</p>
            <p><strong>Price:</strong> ₹${appointment.price}</p>
          </div>
        </div>
      `,
    }

    try {
      // Send email to customer
      const customerResult = await transporter.sendMail(customerMailOptions)
      console.log("Appointment confirmation email sent to customer:", customerResult.response)
    } catch (customerEmailError) {
      console.error("Error sending email to customer:", customerEmailError)
      // Continue even if customer email fails
    }

    try {
      // Send email to owner
      const ownerResult = await transporter.sendMail(ownerMailOptions)
      console.log("Appointment notification email sent to owner:", ownerResult.response)
    } catch (ownerEmailError) {
      console.error("Error sending email to owner:", ownerEmailError)
      // Continue even if owner email fails
    }

    return true
  } catch (error) {
    console.error("Error sending appointment emails:", error)
    return false
  }
}

export async function sendOrderConfirmationEmail(order: OilOrder) {
  try {
    console.log("Sending order confirmation email to:", order.email)

    const transporter = createTransporter()

    const itemsList = order.items
      .map((item) => `<li>${item.quantity} × ${item.name} (${item.size}) - ₹${item.price * item.quantity}</li>`)
      .join("")

    // Email to customer
    const customerMailOptions = {
      from: "keerthanasrinivasansarala@gmail.com",
      to: order.email,
      subject: "Order Confirmation - Sri Ragavendre Agro Industries",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4CAF50; text-align: center;">Order Confirmed!</h2>
          <p>Dear ${order.name},</p>
          <p>Thank you for your order with Sri Ragavendre Agro Industries. Your order has been confirmed and is being processed.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <ul>
              ${itemsList}
            </ul>
            <p><strong>Subtotal:</strong> ₹${order.subtotal}</p>
            <p><strong>Delivery Charge:</strong> ₹${order.deliveryCharge}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Delivery Address:</strong> ${order.address}, ${order.city}, ${order.state}, ${order.pincode}</p>
          </div>
          
          <p>If you have any questions about your order, please contact us at +91 9876543210.</p>
          <p>Thank you for shopping with us!</p>
          
          <p style="margin-top: 30px;">Best Regards,<br>Sri Ragavendre Agro Industries Team</p>
        </div>
      `,
    }

    // Email to owner
    const ownerMailOptions = {
      from: "noreply@sriragavendreagro.com", // Use a consistent sender
      to: "keerthanasrinivasansarala@gmail.com",
      subject: "New Coconut Oil Order - Sri Ragavendre Agro Industries",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4CAF50; text-align: center;">New Order Received!</h2>
          <p>A new coconut oil order has been placed.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Details:</h3>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state}, ${order.pincode}</p>
            
            <h3 style="margin-top: 15px;">Order Details:</h3>
            <ul>
              ${itemsList}
            </ul>
            <p><strong>Subtotal:</strong> ₹${order.subtotal}</p>
            <p><strong>Delivery Charge:</strong> ₹${order.deliveryCharge}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>
        </div>
      `,
    }

    try {
      // Send email to customer
      const customerResult = await transporter.sendMail(customerMailOptions)
      console.log("Order confirmation email sent to customer:", customerResult.response)
    } catch (customerEmailError) {
      console.error("Error sending email to customer:", customerEmailError)
      // Continue even if customer email fails
    }

    try {
      // Send email to owner
      const ownerResult = await transporter.sendMail(ownerMailOptions)
      console.log("Order notification email sent to owner:", ownerResult.response)
    } catch (ownerEmailError) {
      console.error("Error sending email to owner:", ownerEmailError)
      // Continue even if owner email fails
    }

    return true
  } catch (error) {
    console.error("Error sending order emails:", error)
    return false
  }
}
