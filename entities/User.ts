import { Gym } from "./Gym";
import { Partner } from "./Partner";
import { RefreshToken } from "./RefreshToken";
import { Role } from "./Role";

export type Status = "DISABLED" | "ENABLED";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  status: Status;
  roleId?: string | null;
  role?: Role | null;
  partnerId?: string | null;
  partner?: Partner | null;
  gymId?: string | null;
  gym?: Gym | null;
  refreshTokens?: RefreshToken[];
  createdAt: Date;
  updatedAt: Date;
}

// JWT Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  profession?: string;
  imageUrl?: string;
  status: Status;
  role?: {
    id: string;
    title: string;
  };
  partner?: {
    id: string;
    name: string;
  };
  gym?: {
    id: string;
    name: string;
  };
}


export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
