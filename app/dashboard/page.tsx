'use client'

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOut } from "lucide-react"

export default function DashboardPage(){
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

    return(
        <div className="min-h-screen bg-background">
            {/* Header with logout button */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main content */}
            <main className="container py-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome to your dashboard</h2>
                        <p className="text-muted-foreground">
                            Manage your account and access your features here.
                        </p>
                    </div>
                    
                    {/* Dashboard content placeholder */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border p-6">
                            <h3 className="font-semibold">Feature 1</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Your dashboard content goes here.
                            </p>
                        </div>
                        <div className="rounded-lg border p-6">
                            <h3 className="font-semibold">Feature 2</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                More dashboard content.
                            </p>
                        </div>
                        <div className="rounded-lg border p-6">
                            <h3 className="font-semibold">Feature 3</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Additional features here.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}