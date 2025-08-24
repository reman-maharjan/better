
import { db } from "@/db/drizzle"; // your drizzle instance
import {schema} from "@/db/schema"
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {nextCookies} from "better-auth/next-js" 
import {Resend} from "resend"
import ForgotPasswordEmail from "../components/emails/reset-password"
import VerifyEmail from "@/components/emails/verify-email";

// Validate required environment variables
if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required but not found in environment variables');
}
if (!process.env.EMAIL_SENDER_NAME) {
    throw new Error('EMAIL_SENDER_NAME is required but not found in environment variables');
}
if (!process.env.EMAIL_SENDER_ADDRESS) {
    throw new Error('EMAIL_SENDER_ADDRESS is required but not found in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Debug logging for environment variables
console.log('Environment check:');
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
console.log('EMAIL_SENDER_NAME:', process.env.EMAIL_SENDER_NAME);
console.log('EMAIL_SENDER_ADDRESS:', process.env.EMAIL_SENDER_ADDRESS);


export const auth = betterAuth({
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token: _token }) => {
            console.log('🔄 Attempting to send verification email to:', user.email);
            console.log('📧 Email config:', {
                from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                to: user.email,
                hasApiKey: !!process.env.RESEND_API_KEY,
                url: url
            });
            
            try {
                const result = await resend.emails.send({
                    from : `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                    to: user.email,
                    subject: "Verify your email address",
                    react: VerifyEmail({username: user.name || user.email, verifyUrl: url }),
                });
                console.log('✅ Verification email sent successfully:', result);
                // Don't return the result - better-auth expects void
            } catch (error: unknown) {
                console.error('❌ Failed to send verification email:', error);
                console.error('Error details:', JSON.stringify(error, null, 2));
                
                // Check for common Resend restrictions
                if (error instanceof Error && (error.message.includes('not verified') || error.message.includes('domain'))) {
                    console.error('🚨 RESEND RESTRICTION: Email domain not verified or recipient not in verified list');
                    console.error('💡 Solution: Verify your domain in Resend dashboard or add recipient to verified emails');
                }
                
                throw error;
            }
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true
    },

    emailAndPassword:{
        enabled:true,   
        sendResetPassword:async({user,url})=>{
            try {
                await resend.emails.send({
                    from:`${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                    to: user.email,
                    subject:"Reset your password",
                    react:ForgotPasswordEmail({username:user.name, resetUrl:url,userEmail:user.email }),
                });
                console.log('Reset password email sent to:', user.email);
            } catch (error) {
                console.error('Failed to send reset password email:', error);
                throw error;
            }
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
