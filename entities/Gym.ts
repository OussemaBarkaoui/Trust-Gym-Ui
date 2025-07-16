export interface Gym {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGymRequest {
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
}

export interface UpdateGymRequest {
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
}
