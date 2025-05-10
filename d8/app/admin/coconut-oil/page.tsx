"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { OilOrder } from "@/lib/models"

export default function CoconutOilOrdersPage() {
  const [orders, setOrders] = useState<OilOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Fetched orders:", data)
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        // For demo purposes, use mock data if API fails
        setOrders([
          {
            _id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "9876543210",
            address: "123 Main St",
            city: "Chennai",
            state: "Tamil Nadu",
            pincode: "600001",
            items: [{ id: "half-liter", name: "Coconut Oil", size: "500ml", price: 150, quantity: 2 }],
            subtotal: 300,
            deliveryCharge: 50,
            total: 350,
            paymentMethod: "COD",
            status: "Processing",
            createdAt: new Date(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return <div className="container py-10">Loading orders...</div>
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Coconut Oil Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableCaption>A list of all coconut oil orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id?.toString()}>
                  <TableCell className="font-medium">{order.name}</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {order.address}, {order.city}, {order.state}, {order.pincode}
                  </TableCell>
                  <TableCell>
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.quantity} × {item.name} ({item.size})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>₹{order.total}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "Delivered" ? "default" : order.status === "Shipped" ? "secondary" : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
