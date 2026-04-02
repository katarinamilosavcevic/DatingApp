export type Member = {
  id: string;
  dateOfBirth: string;
  imageUrl?: string;
  displayName: string;
  created: string;
  lastActive: string;
  gender: string;
  description?: string;
  city: string;
  country: string;
};

export type Photo = {
  id: number;
  url: string;
  publicId?: string;
  memberId: string;
  isApproved: boolean;
};

export type MemberParams = {
  gender?: string;
  minAge: number;
  maxAge: number;
  pageNumber: number;
  pageSize: number;
  orderBy: string;
};

export type EditableMember = {
  displayName: string;
  description?: string;
  city: string;
  country: string;
};