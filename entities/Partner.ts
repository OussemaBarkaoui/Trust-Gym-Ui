export interface Partner {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePartnerRequest {
  name: string;
}

export interface UpdatePartnerRequest {
  name?: string;
}
