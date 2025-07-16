export interface MemberAnnualFee {
  id: string;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberAnnualFeeRequest {
  amount: number;
  dueDate: Date;
  memberId: string;
}

export interface UpdateMemberAnnualFeeRequest {
  amount?: number;
  dueDate?: Date;
  isPaid?: boolean;
}
