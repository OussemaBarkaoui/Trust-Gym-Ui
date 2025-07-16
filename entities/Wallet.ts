export interface Wallet {
  id: string;
  amount: number;
  memberId: string;
  partnerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWalletRequest {
  amount: number;
  memberId: string;
  partnerId?: string;
}

export interface UpdateWalletRequest {
  amount?: number;
  partnerId?: string;
}
