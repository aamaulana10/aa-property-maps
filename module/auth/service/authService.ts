import supabase from "@/lib/supabase"
import { AuthResult } from "../entity/AuthResult"
import { AuthRepository } from "../repository/authRepository"
import { PostgrestError } from "@supabase/supabase-js"
import { log } from "console";


export class AuthService implements AuthRepository {
  private async checkUserExists(user: any): Promise<{ exists: boolean; error: PostgrestError | null }> {
    const { data, error } = await supabase
    .from("Users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

      console.log("data is ", data);
      console.log("error is ", error);
      console.log("exists is ", !!data);
      

    return {
      exists: !!data,
      error
    }
  }

  private async registerUser(id: string, email: string): Promise<AuthResult> {
    const { data, error } = await supabase
      .from("Users")
      .insert([{ id, email }])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "User registered successfully",
    };
  }

  async sendMagicLink(email: string): Promise<AuthResult> {

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login/callback`
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

  public async handleAuthCallback(): Promise<AuthResult> {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        success: false,
        message: "Gagal login. User tidak ditemukan atau error.",
      };
    }

    const { exists, error: checkError } = await this.checkUserExists(user);
    if (checkError) {
      return {
        success: false,
        message: "Gagal cek user: " + checkError.message,
      };
    }

    if (!exists) {
      const registerResult = await this.registerUser(user.id, user.email!);
      if (!registerResult.success) return registerResult;
    }

    return {
      success: true,
      message: "Berhasil login atau register.",
    };
  }
}