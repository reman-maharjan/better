import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  return (
    <div className="flex space-x-4">
      <Link href="/login">
        <Button variant="secondary">Login</Button>
      </Link>
      <Link href="/signup">
        <Button variant="secondary">Signup</Button>
      </Link>
    </div>
  );
}
