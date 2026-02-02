import { UUID, GenderPreference, GroupStatus } from "@/types/common.types";

/* ---------- Group Card ---------- */

export interface GroupCard {
  id: UUID;
  groupName: string;
  groupImageUrl: string | null;
  genderPreference: GenderPreference;
  membersCount: number;
  maxMembers: number;
  tags: string[];
  createdBy: UUID;
}

export interface GroupPermissions {
  isMember: boolean;
  isAdmin: boolean;
}
/* ---------- Group Member ---------- */
export interface GroupMemberDetails {
  id: UUID;
  name: string;
  profile_picture: string | null;
  dateOfBirth?: string | null;
  age?: number | null; 
  sex?: string | null;  
  rating?: number | null;
}

export interface GroupMember {
  userId: UUID;
    role: 'admin' | 'member';
    userDetails: GroupMemberDetails;
}

/* ---------- Group Details ---------- */


export interface GroupDetails {
  id: UUID;
  groupName: string;
  description: string;
  groupImageUrl: string | null;
  locationId: UUID;
  locationName: string;
  month: string;
  genderPreference: GenderPreference;
  membersCount: number;
  maxMembers: number;
  tags: string[];
  status: GroupStatus;
  members: GroupMember[];
  isMember: boolean;
  isAdmin: boolean;
  chatId?: UUID;
//   userTripId?: UUID;
  permissions: GroupPermissions;
}

/* ---------- Create Group ---------- */

export interface CreateGroupPayload {
  tripId: UUID;
  groupName: string;
  maxMembers: number;
  genderPreference: GenderPreference;
  tags?: string[];
  description?: string;
}
