"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function OwnerLoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Check if the email and password match the owner credentials
    const isValidOwner =
      (email === "keerthanasrinivasansarala@gmail.com" && password === "ks@222211") ||
      (email === "rithanyas.22ece@kongu.edu" && password === "rithu4")

    if (isValidOwner) {
      // Store owner authentication status in localStorage
      localStorage.setItem("isOwnerAuthenticated", "true")

      setTimeout(() => {
        toast({
          title: "Login successful",
          description: "Welcome back, Owner",
        })
        router.push("/admin")
      }, 1000)
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid owner credentials",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="owner-email">Email</Label>
        <Input
          id="owner-email"
          type="email"
          placeholder="owner@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="owner-password">Password</Label>
        <Input
          id="owner-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
