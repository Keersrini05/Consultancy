import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserLoginForm } from "@/components/user-login-form"
import { UserSignupForm } from "@/components/user-signup-form"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { OwnerLoginForm } from "@/components/owner-login-form"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sri Ragavendre Agro Industries</CardTitle>
          <CardDescription className="text-center">Login to access our services</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user-login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user-login">Customer</TabsTrigger>
              <TabsTrigger value="owner-login">Owner</TabsTrigger>
            </TabsList>
            <TabsContent value="user-login">
              <Tabs defaultValue="login" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="forgot">Forgot</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <UserLoginForm />
                </TabsContent>
                <TabsContent value="signup">
                  <UserSignupForm />
                </TabsContent>
                <TabsContent value="forgot">
                  <ForgotPasswordForm />
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="owner-login">
              <OwnerLoginForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">© 2025 Sri Ragavendre Agro Industries</p>
        </CardFooter>
      </Card>
    </div>
  )
}
