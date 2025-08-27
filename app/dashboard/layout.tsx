import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
children,
}: {
    children: React.ReactNode
}){
    return(
        <div>
            <Header/>
            {children}
        </div>
    )
}

