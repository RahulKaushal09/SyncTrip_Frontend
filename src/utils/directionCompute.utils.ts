import apiClient from "./apiClient";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface ComputeRouteRequest {
  origin: LatLng;
  destination: LatLng;
  waypoints?: LatLng[];
  optimize?: boolean;
}

export interface ComputeRouteResponse {
  polyline: string;
  totalKm: number;
  legDistancesKm: number[];
  waypointOrder: number[] | null;
  cached?: boolean;
}
export class DirectionComputeUtils {
  static async computeRoute(
    payload: ComputeRouteRequest
  ): Promise<ComputeRouteResponse> {

    const res = await apiClient.post<ComputeRouteResponse>(
      "/directions/compute",
      payload // ✅ DO NOT wrap in { body: ... }
    );

    return res.data;
  }
}