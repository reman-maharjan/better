
import { db } from "@/db/drizzle"; // your drizzle instance
import {schema} from "@/db/schema"
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {nextCookies} from "better-auth/next-js" 
import {Resend} from "resend"
import ForgotPasswordEmail from "../components/emails/reset-password"
import VerifyEmail from "@/components/emails/verify-email";
import {organization} from "better-auth/plugins/organization";
import { getActiveOrganization } from "@/server/organization";

// Initialize Resend with fallback for build time
const resend = new Resend(process.env.RESEND_API_KEY || 'build-time-placeholder');

// Runtime validation function
const validateEmailConfig = () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is required but not found in environment variables');
    }
    if (!process.env.EMAIL_SENDER_NAME) {
        throw new Error('EMAIL_SENDER_NAME is required but not found in environment variables');
    }
    if (!process.env.EMAIL_SENDER_ADDRESS) {
        throw new Error('EMAIL_SENDER_ADDRESS is required but not found in environment variables');
    }
};


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token: _token }) => {
            // Validate environment variables at runtime
            validateEmailConfig();
            
            // Construct proper verification URL with token
            const verificationUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/verify-email?token=${_token}`;
            
            console.log('🔄 Attempting to send verification email to:', user.email);
            console.log('📧 Email config:', {
                from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                to: user.email,
                hasApiKey: !!process.env.RESEND_API_KEY,
                originalUrl: url,
                verificationUrl: verificationUrl,
                token: _token
            });
            
            try {
                const result = await resend.emails.send({
                    from : `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                    to: user.email,
                    subject: "Verify your email address",
                    react: VerifyEmail({username: user.name || user.email, verifyUrl: verificationUrl }),
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
            // Validate environment variables at runtime
            validateEmailConfig();
            
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
    databaseHooks:{
        session:{
            create:{
                before:async(session)=>{
                    const organization=await getActiveOrganization(session.userId)
                    return{
                        data:{
                            ...session,
                            activeOrganizationId:organization?.id,
                        }
                    }
                }
            }
        }
    },


    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    plugins:[organization(),nextCookies()],
    socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
        google:{
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }
    } : {}
});
