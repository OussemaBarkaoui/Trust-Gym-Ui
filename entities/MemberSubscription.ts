import { Member } from "./Member";

export interface Payment {
  id: string;
  amount: string;
  isPaid: boolean;
  payedAmount: string;
  typeOfPayment: string;
  createdAt: string;
}

export interface GymSubscription {
  id: string;
  name: string;
  price: string;
}

export interface GymLocation {
  id: string;
  location: string;
}

export interface MemberSubscription {
  id: string;
  startDate: string;
  endDate: string;
  subscriptionAmount: number;
  paidAmount: string;
  remainingAmount: number;
  createdAt: string;
  member: Member;
  gymSubscription: GymSubscription;
  gym: GymLocation;
  payments: Payment[];
}

export interface MemberSubscriptionsResponse {
  data: MemberSubscription[];
  totalItems: number;
  statusCode: number;
  message: string;
}
