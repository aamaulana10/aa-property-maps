import { AuthResult } from "../entity/AuthResult";

export interface AuthRepository {
    sendMagicLink(email: string): Promise<AuthResult>
  }