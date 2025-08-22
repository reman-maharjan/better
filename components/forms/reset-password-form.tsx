'use client';


import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {z} from "zod"
import {toast} from "sonner"
import {useState} from "react"
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const formSchema=z.object({
    password:z.string().min(8),
    confirmPassword:z.string().min(8),
})

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading,setIsLoading]=useState(false)
  const router=useRouter()
  const searchParams = useSearchParams()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password:"",
      confirmPassword:"",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
  setIsLoading(true)
  
  // Validate passwords match on frontend
  if (values.password !== values.confirmPassword) {
    toast.error("Passwords do not match")
    setIsLoading(false)
    return
  }
  
  const token = searchParams.get('token')
  
  if (!token) {
    toast.error("Invalid reset token")
    setIsLoading(false)
    return
  }
  
  const {error}=await authClient.resetPassword({
    newPassword: values.password,
    token: token
  })
  
  if(error){
    toast.error(error.message)
  }
  else{
    toast.success("Password reset successfully")
    router.push("/login")
  }


  setIsLoading(false)
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              
           
              
                <div className="grid gap-3">
                <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
                </div>
                <div className="grid gap-3">
                <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
                </div>               
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading?(
                    <Loader2 className="size-4 animate-spin"/> 
                  ):(
                  "Reset Password"
                  )
                  }
                </Button>
                
              
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
