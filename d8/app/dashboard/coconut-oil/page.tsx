"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size: string
}

export default function CoconutOilPage() {
  const { toast } = useToast()
  const [cart, setCart] = useState<Product[]>([])

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
      console.log("Cart saved to localStorage:", cart)
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [cart])

  const products = [
    {
      id: "half-liter",
      name: "Coconut Oil",
      price: 150,
      image: "/placeholder.svg?height=200&width=200",
      size: "500ml",
    },
    {
      id: "one-liter",
      name: "Coconut Oil",
      price: 280,
      image: "/placeholder.svg?height=200&width=200",
      size: "1 Liter",
    },
  ]

  const addToCart = (product: Omit<Product, "quantity">) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id)

      if (existingProduct) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })

    toast({
      title: "Added to cart",
      description: `${product.name} (${product.size}) added to your cart`,
    })
  }

  const updateQuantity = (id: string, change: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change)
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="container py-10">
      <div className="flex justify-end mb-4">
        <Button asChild variant="outline" className="relative">
          <Link href="/dashboard/coconut-oil/cart">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </Button>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Coconut Oil Mill</h1>
        <p className="text-muted-foreground mb-4">
          Our coconut oil is cold-pressed using traditional methods to preserve all the natural goodness. We use only
          the finest coconuts sourced from local farmers to ensure the highest quality oil. Our oil is 100% pure,
          unrefined, and free from any additives or preservatives.
        </p>
        <p className="text-muted-foreground mb-4">
          Rich in medium-chain fatty acids and antioxidants, our coconut oil is perfect for cooking, skin care, and hair
          care. Experience the authentic taste and aroma of pure coconut oil.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-6">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id)
          const quantity = cartItem ? cartItem.quantity : 0

          return (
            <Card key={product.id} className="overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <div className="relative h-48 w-48 mb-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={`${product.name} ${product.size}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  {product.name} - {product.size}
                </h3>
                <p className="text-2xl font-bold mt-2">₹{product.price}</p>

                {quantity > 0 ? (
                  <div className="flex items-center gap-4 mt-4">
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(product.id, -1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(product.id, 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button className="mt-4" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
