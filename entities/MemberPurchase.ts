export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  WALLET = "WALLET",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export interface MemberPurchase {
  id: string;
  memberId: string;
  productId: string;
  gymId: string;
  quantity: number;
  total: number;
  isPaid: boolean;
  paymentMethod?: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberPurchaseRequest {
  memberId: string;
  productId: string;
  gymId: string;
  quantity: number;
  total: number;
  isPaid?: boolean;
  paymentMethod?: PaymentMethod;
}
