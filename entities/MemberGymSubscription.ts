export interface MemberGymSubscription {
  id: string;
  conventionId?: string;
  gymSubscriptionId: string;
  memberId: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberGymSubscriptionRequest {
  conventionId?: string;
  gymSubscriptionId: string;
  memberId: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateMemberGymSubscriptionRequest {
  conventionId?: string;
  startDate?: Date;
  endDate?: Date;
}
