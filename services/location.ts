import { supabase } from "@/lib/supabase";

export interface VehicleLocation {
  id: string;
  user_id: string;
  vehicle_id: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface LocationResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

/**
 * Save or update the parking location of a vehicle.
 */
export async function saveVehicleLocation(
  vehicleId: string,
  latitude: number,
  longitude: number
): Promise<LocationResponse<VehicleLocation | null>> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not authenticated.",
      };
    }

    const { data, error } = await supabase
      .from("vehicle_locations")
      .upsert(
        {
          user_id: user.id,
          vehicle_id: vehicleId,
          latitude,
          longitude,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "vehicle_id",
        }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (err: unknown) {
    console.error("Save vehicle location error:", err);

    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to save vehicle location.",
    };
  }
}

/**
 * Get the saved parking location of one vehicle.
 */
export async function getVehicleLocation(
  vehicleId: string
): Promise<LocationResponse<VehicleLocation | null>> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not authenticated.",
      };
    }

    const { data, error } = await supabase
      .from("vehicle_locations")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data ?? null,
      error: null,
    };
  } catch (err: unknown) {
    console.error("Get vehicle location error:", err);

    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to load vehicle location.",
    };
  }
}

/**
 * Delete the saved parking location of a vehicle.
 */
export async function deleteVehicleLocation(
  vehicleId: string
): Promise<LocationResponse<null>> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not authenticated.",
      };
    }

    const { error } = await supabase
      .from("vehicle_locations")
      .delete()
      .eq("vehicle_id", vehicleId)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (err: unknown) {
    console.error("Delete vehicle location error:", err);

    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to delete vehicle location.",
    };
  }
}