import supabase from "@/lib/supabase"
import { AuthResult } from "../entity/AuthResult"
import { AuthRepository } from "../repository/authRepository"


export class AuthService implements AuthRepository {
  async sendMagicLink(email: string): Promise<AuthResult> {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      message: 'Magic link sent! Please check your email.',
    }
  }
}