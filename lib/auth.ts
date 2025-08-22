
import { db } from "@/db/drizzle"; // your drizzle instance
import {schema} from "@/db/schema"
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {nextCookies} from "better-auth/next-js" 
import {Resend} from "resend"
import ForgotPasswordEmail from "../components/emails/reset-password"
import VerifyEmail from "@/components/emails/verify-email";

const resend=new Resend(process.env.RESEND_API_KEY as string)


export const auth = betterAuth({
    emailVerification: {
        sendVerificationEmail: async ({ user, url}) => {
       resend.emails.send({
        from : `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to:user.email,
        subject:"Verify your email address",
        react:VerifyEmail({username:user.name, verifyUrl:url }),



       })
        },
        sendOnSignUp:true
    },

    emailAndPassword:{
        enabled:true,   
        sendResetPassword:async({user,url})=>{
            resend.emails.send({
                from:`${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                to: user.email,
                subject:"Reset your password",
                react:ForgotPasswordEmail({username:user.name, resetUrl:url,userEmail:user.email }),
            })
        },
       requiredEmailVerification:true
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
