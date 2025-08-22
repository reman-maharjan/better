import { ResetPasswordForm } from "@/components/forms/reset-password-form"
import { Suspense } from "react"

export default function ResetForm(){
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm/>
        </Suspense>
    )
}