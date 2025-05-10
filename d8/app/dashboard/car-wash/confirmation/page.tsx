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
          <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Thank you for booking an appointment with us. Your car wash appointment has been confirmed.</p>
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">Appointment #54321</p>
            <p className="text-sm text-muted-foreground">April 19, 2025 at 2:00 PM</p>
          </div>
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address from keerthanas.22ece@kongu.edu
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
