"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { verifyEmail } from "@/server/users";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleVerifyEmail = async () => {
      const token = searchParams.get("token");
      
      console.log('🔍 Verification page - URL params:', window.location.search);
      console.log('🔍 Verification page - Token:', token);
      
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. No token provided.");
        return;
      }

      try {
        console.log('🔄 Calling verifyEmail function with token:', token);
        const result = await verifyEmail(token);
        console.log('📋 Verification result:', result);

        if (result.success) {
          setStatus("success");
          setMessage("Your email has been successfully verified! You can now sign in to your account.");
        } else {
          setStatus("error");
          setMessage(result.message || "Failed to verify email. The link may be expired or invalid.");
        }
      } catch (error) {
        console.error('❌ Verification error:', error);
        setStatus("error");
        setMessage("An error occurred while verifying your email. Please try again.");
      }
    };

    handleVerifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your email address."}
            {status === "success" && "Your account is now active."}
            {status === "error" && "There was a problem verifying your email."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {status === "loading" && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            )}
            {status === "success" && (
              <div className="text-green-600 text-4xl mb-4">✓</div>
            )}
            {status === "error" && (
              <div className="text-red-600 text-4xl mb-4">✗</div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 text-center">{message}</p>
          
          
          {status !== "loading" && (
            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/login">
                  {status === "success" ? "Sign In" : "Back to Login"}
                </Link>
              </Button>
              
              {status === "error" && (
                <Button variant="outline" asChild className="w-full">
                  <Link href="/register">Try Signing Up Again</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
          <CardDescription>Please wait while we prepare your verification.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
