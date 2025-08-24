"use server";

import {auth} from "@/lib/auth"
import { headers } from "next/headers"

export const signIn=async(email:string,password:string)=>{
    try{
    await auth.api.signInEmail({
        body:{
            email,
            password,
        },
        headers: await headers()
    })
    return{
        success: true,
        message:"Signed In"
    }
    
    }catch(error){  
    const e=error as Error
        return{    
        success: false,
        message:e.message || "An unknown error occured"
    }}
}

export const forgotPassword=async(email:string)=>{
    try{
    await auth.api.forgetPassword({
        body:{
            email,
            redirectTo: "/reset-password"
        }   
    })
    return{
        success: true,
        message:"Password reset email sent"
    }
    
    }catch(error){  
    const e=error as Error
        return{    
        success: false,
        message:e.message || "An unknown error occured"
    }}
}

export const signUp=async(username:string,email:string,password:string)=>{
    try{
    console.log('🔄 Starting signup process for:', email);
    await auth.api.signUpEmail({
        body:{
            email,
            password,
            name:username
        },
        headers: await headers()
    })
    console.log('✅ Signup completed for:', email);
    return{
        success: true,
        message:"Account created successfully!"
    }
    
    }catch(error){  
    const e=error as Error
        return{    
        success: false,
        message:e.message || "An unknown error occured"
    }}
}

export const resendVerificationEmail=async(email:string)=>{
    try{
    console.log('🔄 Resending verification email to:', email);
    await auth.api.sendVerificationEmail({
        body:{
            email
        },
        headers: await headers()
    })
    console.log('✅ Verification email resent to:', email);
    return{
        success: true,
        message:"Verification email sent"
    }
    
    }catch(error){  
    const e=error as Error
        return{    
        success: false,
        message:e.message || "Failed to send verification email"
    }}
}

export const verifyEmail=async(token:string)=>{
    try{
    console.log('🔄 Attempting to verify email with token:', token);
    await auth.api.verifyEmail({
        query:{
            token
        },
        headers: await headers()
    })
    console.log('✅ Email verification successful for token:', token);
    return{
        success: true,
        message:"Email verified successfully"
    }
    
    }catch(error){  
    const e=error as Error
        return{    
        success: false,
        message:e.message || "Invalid or expired verification token"
    }}
}

export const checkEmailVerification=async()=>{
    try{
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return{
        success: true,
        isVerified: session?.user?.emailVerified || false
    }
    
    }catch(error){  
    const e=error as Error
        return{    
        success: false,
        message:e.message || "Failed to check email verification status",
        isVerified: false
    }}
}