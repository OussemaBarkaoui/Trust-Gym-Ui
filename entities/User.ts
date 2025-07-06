// You may centralize all backend models here for type safety.

export type Status = "DISABLED" | "ENABLED";

export interface Role {
  id: string;
  title: string;
  // Add other role fields if needed
}

export interface Partner {
  id: string;
  name: string;
  // Add other partner fields if needed
}

export interface Gym {
  id: string;
  name: string;
  // Add other gym fields if needed
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiryDate: string;
  // Add other fields if needed
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // never expose this in UI logic
  status: Status;
  roleId?: string | null;
  role?: Role | null;
  partnerId?: string | null;
  partner?: Partner | null;
  gymId?: string | null;
  gym?: Gym | null;
  refreshTokens?: RefreshToken[];
}