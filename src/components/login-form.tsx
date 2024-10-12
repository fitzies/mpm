"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth";
import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to login to your account.
        </CardDescription>
      </CardHeader>
      <form
        action={async (data) => {
          try {
            setLoading(() => true);
            await signIn(data);
          } catch (error: unknown) {
            setLoading(() => false);
            if (error instanceof Error) {
              setError(() => error.message);
            } else {
              setError(() => "Something went wrong.");
            }
          }
        }}
      >
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              name="username"
              type="text" // Changed to text; "username" is not a valid input type
              placeholder="johndoe"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input name="password" type="password" required />
          </div>
          <Button className="w-full" disabled={loading}>
            {loading ? "..." : "Sign in"}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col gap-2">
        <div className="text-left w-full text-sm text-red-400">{error}</div>
      </CardFooter>
    </Card>
  );
}
