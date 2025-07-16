export interface Role {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleRequest {
  title: string;
}

export interface UpdateRoleRequest {
  title?: string;
}
