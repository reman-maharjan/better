// app/dashboard/dashboard-client.tsx
"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOut } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateOrganizationForm } from "@/components/forms/create-organization-form"

interface Organization {
  id: string
  name: string
  slug: string
}

export default function DashboardClient({ organizations }: { organizations: Organization[] }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      toast.success("Logged out successfully")
      router.push("/login")
    } catch {
      toast.error("Failed to logout")
    }
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
              <CreateOrganizationForm />
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

        <div className="mt-6 flex flex-col gap-2">
          {organizations.map((organization) => (
            <Button variant="outline" key={organization.id} asChild>
              <Link href={`/dashboard/organization/${organization.slug}`}>
                {organization.name}
              </Link>
            </Button>
          ))}
        </div>
      </main>
    </div>
  )
}
