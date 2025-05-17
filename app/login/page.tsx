'use client'

import React, { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { AuthService } from "@/module/auth/service/authService"
import { AuthUsecase } from "@/module/auth/usecase/authUsecase"

export default function LoginPage() {

  const [loading, setLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleLogin = async (email: string) => {
    setLoading(true)

    const service = new AuthService()
    const usecase = new AuthUsecase(service)
    const result = await usecase.execute(email);

    console.log('result :>> ', result);
    
    setLoading(false)
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          AaMaulana Inc.
        </a>
        <LoginForm onSubmit={handleLogin} loading={loading} isSent={isSent} />
      </div>
    </div>
  )
}
