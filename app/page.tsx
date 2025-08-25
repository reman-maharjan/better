"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SimpleAuthPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
        The road to freedom starts from here
      </p>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold my-6 text-center">
        Build awesome apps with{" "}
        <span className="text-blue-500 dark:text-blue-500">Better.</span>
      </h1>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Link href="/login" className="w-full md:w-auto">
          <Button className="w-40 h-10 rounded-xl text-sm bg-black text-white dark:border-white border-transparent">
            Login
          </Button>
        </Link>
        <Link href="/register" className="w-full md:w-auto">
        <Button className="w-40 h-10 rounded-xl text-sm bg-black text-white dark:border-white border-transparent">
            Signup
          </Button>
        </Link>
      </div>
    </div>
  );
}
