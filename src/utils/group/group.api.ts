import apiClient from "@/utils/apiClient";
import {
    GroupCard,
    GroupDetails,
    CreateGroupPayload
} from "./group.types";
import { Chat, UUID } from "@/types";

interface GroupInt {
    createdAt: string;
    createdBy: string;
    description: string;
    genderPreference?: string;
    groupImageUrl?: string;
    groupName?: string;
    id: string;
    locationId: string;
    locationName: string;
    maxMembers: number;
    membersCount?: number;
    month?: string;
    status?: string;
    tags?: string[];
}

/* ---------- GET GROUPS ---------- */
export interface JoinGroupResponse {
    chat: Chat,
    group: GroupInt
}

export interface GroupDetailsResponse {
    group: GroupDetails;
    // tripId: UUID;
}

export class GroupApiServices {

    static async getGroupsByLocationAndMonth(
        locationId: string,
        month: string
    ): Promise<GroupCard[]> {
        const res = await apiClient.get("/groups", {
            params: { locationId, month }
        });
        return res.data.groups;
    };

    /* ---------- CREATE GROUP ---------- */

    static async createGroupTrip(
        payload: CreateGroupPayload
    ): Promise<GroupDetails> {
        const res = await apiClient.post("/groups", payload);
        return res.data.group;
    };

    /* ---------- JOIN GROUP ---------- */



    static async joinGroupTrip(
        groupTripId: UUID,
        userTripId: UUID
    ): Promise<JoinGroupResponse> {
        const res = await apiClient.post(`/groups/${groupTripId}/join`, { userTripId });
        return res.data;
    }

    /* ---------- GROUP DETAILS ---------- */

    static async getGroupDetails(
        groupTripId: string
    ): Promise<GroupDetailsResponse> {
        const res = await apiClient.get(`/groups/${groupTripId}`);
        return res.data;
    };

    /* ---------- MY GROUPS ---------- */

    static async getMyGroups(): Promise<GroupCard[]> {
        const res = await apiClient.get("/groups/my/groups");
        return res.data.groups;
    };

}

