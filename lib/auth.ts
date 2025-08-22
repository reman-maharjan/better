
import { db } from "@/db/drizzle"; // your drizzle instance
import {schema} from "@/db/schema"
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {nextCookies} from "better-auth/next-js" 
import {Resend} from "resend"
import ForgotPasswordEmail from "../components/emails/reset-password"

const resend=new Resend(process.env.RESEND_API_KEY as string)


export const auth = betterAuth({


    emailAndPassword:{
        enabled:true,   
        sendResetPassword:async({user,url})=>{
            resend.emails.send({
                from:"onboarding@resend.dev",
                to: user.email,
                subject:"Reset your password",
                react:ForgotPasswordEmail({username:user.name, resetUrl:url,userEmail:user.email }),
            })
        }
       
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema,
    }),
    plugins:[nextCookies()],
    socialProviders:{
        google:{
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
        }
    }
});
