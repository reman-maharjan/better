'use client';


import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
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
    email:z.string().email(),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading,setIsLoading]=useState(false)
  const router=useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email:"",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
  setIsLoading(true)
  const {error}=await authClient.forgetPassword({
    email:values.email,
    redirectTo:"/reset-password"
  })
  
  if(error){
    toast.error(error.message)
  }
  else{
    toast.success("Password reset email sent")
  }


  setIsLoading(false)
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Forgot your password?
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              
           
              
                <div className="grid gap-3">
                <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
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
                  "Send Reset Email"
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
