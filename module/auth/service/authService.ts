import supabase from "@/lib/supabase"
import { AuthResult } from "../entity/AuthResult"
import { AuthRepository } from "../repository/authRepository"
import { PostgrestError } from "@supabase/supabase-js"
import { log } from "console";


export class AuthService implements AuthRepository {
  private async checkUserExists(email: string): Promise<{ exists: boolean; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('Users')
      .select('email')
      .eq('email', email)
      .maybeSingle()

      console.log("data is ", data);
      console.log("error is ", error);
      console.log("exists is ", !!data);
      console.log("email is ", email);
      

    return {
      exists: !!data,
      error
    }
  }

  private async registerUser(email: string): Promise<AuthResult> {
    const { data, error } = await supabase
      .from('Users')
      .insert([{ email }])
      .select()
      .single()

    if (error) {
      return {
        success: false,
        message: error.message
      }
    }

    return {
      success: true,
      message: 'User registered successfully'
    }
  }

  async sendMagicLink(email: string): Promise<AuthResult> {
    const { exists, error: checkError } = await this.checkUserExists(email)

    if (checkError) {
      return {
        success: false,
        message: 'Error checking user existence: ' + checkError.message
      }
    }

    if (!exists) {
      const registerResult = await this.registerUser(email)
      if (!registerResult.success) {
        return registerResult
      }
    }

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