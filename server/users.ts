"use server";

import {auth} from "@/lib/auth"

export const signIn=async(email:string,password:string)=>{
    try{
    await auth.api.signInEmail({
        body:{
            email,
            password,
        }   
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
    await auth.api.signUpEmail({
        body:{
            email,
            password,
            name:username
        }   
    })
    return{
        success: true,
        message:"Signed Up"
    }
    
    }catch(error){  
    const e=error as Error
        return{    
        success: false,
        message:e.message || "An unknown error occured"
    }}
}
