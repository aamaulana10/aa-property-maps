"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginFormProps = {
  onSubmit: (email: string) => void
  loading: boolean,
  isSent: boolean
}

export function LoginForm({ onSubmit, loading, isSent }: LoginFormProps) {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email)
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome to Your Property Dashboard</CardTitle>
       <CardDescription>
          {isSent
           ? "Please check your email for the login link."
           : "Enter your email address to receive a magic login link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || isSent}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || isSent}>
                {loading ? "Sending..." : isSent ? "Link Sent" : "Send Magic Link"}
              </Button>
              {isSent && (
                  <div className="text-center text-sm text-muted-foreground">
                    Didnt receive the email?{" "}
                    <button
                      type="submit"
                      className="text-primary underline-offset-4 hover:underline"
                      onClick={() => onSubmit(email)}
                    >
                      Resend Link
                    </button>
                  </div>
                )}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
