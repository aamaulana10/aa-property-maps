"use client"

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AuthService } from "@/module/auth/service/authService";
import { AuthUsecase } from "@/module/auth/usecase/authUsecase";

export default function LoginCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const service = new AuthService()
  const usecase = new AuthUsecase(service)

  useEffect(() => {
    const handle = async () => {
        const result = await usecase.handleAuthCallback();
  
        if (!result.success) {
          setErrorMsg(result.message);
          setLoading(false);
          return;
        }
  
        if (window.history.replaceState) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
  
        router.push("/");
      };
  
      handle();
    }, [router]);
  
    if (loading) return <p>Loading... please wait.</p>;
    if (errorMsg) return <p>Error: {errorMsg}</p>;
  
    return null;
}
