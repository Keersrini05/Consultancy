import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="container py-10 flex flex-col items-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Thank you for your order. Your order has been confirmed and will be delivered soon.</p>
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">Order #12345</p>
            <p className="text-sm text-muted-foreground">April 18, 2025</p>
          </div>
          <p className="text-sm text-muted-foreground">A confirmation email has been sent to your email address.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
