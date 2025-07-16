export interface MemberImage {
  id: string;
  fileName: string;
  imageUrl: string;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberImageRequest {
  fileName: string;
  imageUrl: string;
  memberId: string;
}

export interface UpdateMemberImageRequest {
  fileName?: string;
  imageUrl?: string;
}
