import { Access } from "./Access";
import { MemberAnnualFee } from "./MemberAnnualFee";
import { MemberGymSubscription } from "./MemberGymSubscription";
import { MemberImage } from "./MemberImage";
import { MemberPurchase } from "./MemberPurchase";
import { User } from "./User";
import { Wallet } from "./Wallet";
import { WalletEntry } from "./WalletEntry";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface Member extends User {
  dateOfBirth: Date;
  gender: Gender;
  address: string;
  city: string;
  cin: string;
  imageId?: string;
  profession?: string;
  phone: string;
  cardId: string;
  isBlocked: boolean;

  // Relationships
  memberGymSubscriptions: MemberGymSubscription[];
  access: Access[];
  wallet?: Wallet;
  walletEntries: WalletEntry[];
  memberAnnualFees: MemberAnnualFee[];
  memberPurchases: MemberPurchase[];
  memberImage?: MemberImage;
}

// Helper types
export interface CreateMemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: Gender;
  address: string;
  city: string;
  cin: string;
  profession?: string;
  cardId: string;
}

export interface UpdateMemberRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  address?: string;
  city?: string;
  cin?: string;
  profession?: string;
  imageId?: string;
}

export interface MemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: Gender;
  address: string;
  city: string;
  cin: string;
  profession?: string;
  cardId: string;
  isBlocked: boolean;
  imageUrl?: string;
  walletBalance: number;
  activeSubscription?: {
    planName: string;
    status: string;
    endDate: Date;
    daysRemaining: number;
  };
}

export interface MemberStats {
  totalVisits: number;
  lastVisit?: Date;
  totalPurchases: number;
  walletBalance: number;
  subscriptionStatus: "active" | "inactive" | "expired";
  memberSince: Date;
}
