import { supabase } from "@/lib/supabase";

import {
  Vehicle,
  CreateVehicle,
  UpdateVehicle,
  VehicleResponse,
} from "@/types/vehicle";

import { getCurrentUser } from "./auth";

/**
 * Add Vehicle
 */
export async function addVehicle(
  vehicle: CreateVehicle
): Promise<VehicleResponse<Vehicle | null>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated.");
    }

    const { data, error } = await supabase
      .from("vehicles")
      .insert({
        user_id: user.id,
        vehicle_number: vehicle.vehicle_number.toUpperCase(),
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        nickname: vehicle.nickname ?? null,
        phone: vehicle.phone,
        whatsapp: vehicle.whatsapp,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message,
    };
  }
}

/**
 * Get All Vehicles
 */
export async function getVehicles(): Promise<
  VehicleResponse<Vehicle[]>
> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated.");
    }

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return {
      success: true,
      data: data ?? [],
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: [],
      error: err.message,
    };
  }
}
/**
 * Get Single Vehicle
 */
export async function getVehicle(
  id: string
): Promise<VehicleResponse<Vehicle | null>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated.");
    }

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message,
    };
  }
}

/**
 * Update Vehicle
 */
export async function updateVehicle(
  id: string,
  vehicle: UpdateVehicle
): Promise<VehicleResponse<Vehicle | null>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated.");
    }

    const updateData: UpdateVehicle = {
      ...vehicle,
    };

    if (updateData.vehicle_number) {
      updateData.vehicle_number =
        updateData.vehicle_number.toUpperCase();
    }

    const { data, error } = await supabase
      .from("vehicles")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message,
    };
  }
}
/**
 * Delete Vehicle
 */
export async function deleteVehicle(
  id: string
): Promise<VehicleResponse<null>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated.");
    }

    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message,
    };
  }
}

/**
 * Get Vehicle Count
 */
export async function getVehicleCount(): Promise<number> {
  try {
    const user = await getCurrentUser();

    if (!user) return 0;

    const { count } = await supabase
      .from("vehicles")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    return count ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Check if Vehicle Number Already Exists
 */
export async function vehicleExists(
  vehicleNumber: string
): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    if (!user) return false;

    const { count } = await supabase
      .from("vehicles")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "vehicle_number",
        vehicleNumber.toUpperCase()
      )
      .eq("user_id", user.id);

    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}  
  export async function getPublicVehicle(
  id: string
): Promise<VehicleResponse<Vehicle | null>> {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message,
    };
  }
}
