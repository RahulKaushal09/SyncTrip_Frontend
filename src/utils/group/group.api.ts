import apiClient from "@/utils/apiClient";
import {
    GroupCard,
    GroupDetails,
    CreateGroupPayload
} from "./group.types";
import { UUID } from "@/types";

/* ---------- GET GROUPS ---------- */
export interface JoinGroupResponse {
    chatId: UUID;
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
        groupTripId: UUID
        // userTripId: UUID
    ): Promise<JoinGroupResponse> {
        const res = await apiClient.post(`/groups/${groupTripId}/join`);
        return res.data;
    }

    /* ---------- GROUP DETAILS ---------- */

    static async getGroupDetails(
        groupTripId: string
    ): Promise<GroupDetails> {
        const res = await apiClient.get(`/groups/${groupTripId}`);
        return res.data.group;
    };

    /* ---------- MY GROUPS ---------- */

    static async getMyGroups(): Promise<GroupCard[]> {
        const res = await apiClient.get("/groups/my/groups");
        return res.data.groups;
    };

}

