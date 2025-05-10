import type { ObjectId } from "mongodb"

// Oil Order Model
export interface OilOrder {
  _id?: ObjectId | string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  items: {
    id: string
    name: string
    size: string
    price: number
    quantity: number
  }[]
  subtotal: number
  deliveryCharge: number
  total: number
  paymentMethod: string
  status: "Processing" | "Shipped" | "Delivered"
  createdAt: Date
  updatedAt?: Date
}

// Vehicle Wash Appointment Model
export interface VehicleWashAppointment {
  _id?: ObjectId | string
  name: string
  email: string
  phone: string
  vehicleType: "bike" | "car" | "bus" | "lorry"
  vehicleModel: string
  servicePackage: string
  date: string
  time: string
  duration: number // in minutes
  price: number
  status: "Scheduled" | "Completed" | "Cancelled"
  createdAt: Date
  updatedAt?: Date
}

// User Model
export interface User {
  _id?: ObjectId | string
  name: string
  email: string
  password: string
  role: "customer" | "owner"
  createdAt: Date
  updatedAt?: Date
}
