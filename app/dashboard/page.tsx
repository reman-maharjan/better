'use client'

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { LogOut } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateOrganizationForm } from "@/components/forms/create-organization-form"
import { ModeSwitcher } from "@/components/ui/mode-switcher"

interface Organization {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations')
      if (!response.ok) {
        throw new Error('Failed to fetch organizations')
      }
      const data = await response.json()
      setOrganizations(data.organizations || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load organizations')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      toast.success("Logged out successfully")
      router.push("/login")
    } catch {
      toast.error("Failed to logout")
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container flex h-14 items-center justify-between">
        <h1 className="text-lg font-semibold">Dashboard</h1>
       
      </div>
      <main className="container py-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Organizations</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Organization</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Organization</DialogTitle>
                <DialogDescription>
                  Create a new organization to get started.
                </DialogDescription>
              </DialogHeader>
              <CreateOrganizationForm onSuccess={fetchOrganizations} />
            </DialogContent>
          </Dialog>
        </div>

        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      
      </main>
    </div>
  )
}