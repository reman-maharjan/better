'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn, checkEmailVerification, resendVerificationEmail } from "@/server/users"
import { z } from "zod"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm(_props: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showResendButton, setShowResendButton] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true)
      setError(null)
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to sign in with Google")
      toast.error(error.message || "Failed to sign in with Google")
    } finally {
      setGoogleLoading(false)
    }
  }

  const resendVerification = async () => {
    if (!userEmail) return
    try {
      const result = await resendVerificationEmail(userEmail)
      if (result.success) {
        toast.success("Verification email sent! Check your inbox.")
      } else {
        toast.error(result.message || "Failed to send verification email")
      }
    } catch (err) {
      const error = err as Error
      toast.error(error.message || "Failed to send verification email")
    }
  }

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true)
      setError(null)
      setUserEmail(values.email)

      const { success, message } = await signIn(values.email, values.password)
      if (success) {
        const verificationCheck = await checkEmailVerification()
        if (verificationCheck.isVerified) {
          toast.success("Login successful!")
          router.push("/dashboard")
        } else {
          toast.error("Please verify your email before logging in. Check your inbox for the verification link.")
          setShowResendButton(true)
          await authClient.signOut()
        }
      } else {
        setError(message || "Invalid email or password")
        toast.error(message || "Invalid email or password")
        setShowResendButton(false)
      }
    } catch (err) {
      const error = err as Error
      setError(error.message || "An error occurred during login")
      toast.error(error.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            onClick={signInWithGoogle}
            disabled={googleLoading || isLoading}
            className="w-full"
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="github"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
            )}
            Continue with Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          className="pl-9"
                          disabled={isLoading || googleLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="current-password"
                          autoCorrect="off"
                          className="pl-9"
                          disabled={isLoading || googleLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || googleLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
              <div className="text-center text-sm">
                <Link 
                  href="/forgot-password" 
                  className="font-medium text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {showResendButton && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={resendVerification}
                  disabled={isLoading || googleLoading}
                >
                  Resend Verification Email
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-sm text-muted-foreground">
        <p className="text-center">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
