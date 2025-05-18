import { AuthResult } from "../entity/AuthResult";
import { AuthRepository } from "../repository/authRepository";

export class AuthUsecase  {
    constructor(private authRepo: AuthRepository) {}
  
    async execute(email: string): Promise<AuthResult> {
      return this.authRepo.sendMagicLink(email)
    }

    async handleAuthCallback(): Promise<AuthResult> {
      return this.authRepo.handleAuthCallback()
    }
  }