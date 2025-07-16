export interface WalletEntry {
  id: string;
  amount: number;
  memberId: string;
  walletId: string;
  createdByUserId: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWalletEntryRequest {
  amount: number;
  memberId: string;
  walletId: string;
  createdByUserId: string;
  date: string;
}
