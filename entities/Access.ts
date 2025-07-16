export enum AccessType {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
}

export interface Access {
  id: string;
  date: Date;
  time: string;
  dateTime: Date;
  cardId: string;
  isAuthorized: boolean;
  accessType: AccessType;
  memberId: string;
  doorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccessRequest {
  date: Date;
  time: string;
  dateTime: Date;
  cardId: string;
  isAuthorized: boolean;
  accessType: AccessType;
  memberId: string;
  doorId: string;
}
