export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRefreshTokenRequest {
  userId: string;
  token: string;
  expiryDate: Date;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
