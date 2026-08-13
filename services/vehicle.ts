import { supabase } from "@/lib/supabase";

import {
  Vehicle,
  PublicVehicle,
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

        vehicle_number:
          vehicle.vehicle_number
            .toUpperCase()
            .trim(),

        brand: vehicle.brand.trim(),

        model: vehicle.model.trim(),

        year: vehicle.year,

        color: vehicle.color.trim(),

        nickname:
          vehicle.nickname?.trim() || null,

        phone:
          vehicle.phone.trim(),

        whatsapp:
          vehicle.whatsapp.trim(),
      })
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
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error:
        err?.message ??
        "Failed to add vehicle.",
    };
  }
}

/**
 * Get All Vehicles
 *
 * Returns only vehicles belonging
 * to the currently authenticated user.
 */
export async function getVehicles(): Promise<
  VehicleResponse<Vehicle[]>
> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error(
        "User not authenticated."
      );
    }

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data ?? [],
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: [],
      error:
        err?.message ??
        "Failed to load vehicles.",
    };
  }
}

/**
 * Get Single Vehicle
 *
 * Only allows the authenticated owner
 * to access their own vehicle.
 */
export async function getVehicle(
  id: string
): Promise<
  VehicleResponse<Vehicle | null>
> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error(
        "User not authenticated."
      );
    }

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error:
        err?.message ??
        "Failed to load vehicle.",
    };
  }
}

/**
 * Update Vehicle
 *
 * Only allows the authenticated owner
 * to update their own vehicle.
 */
export async function updateVehicle(
  id: string,
  vehicle: UpdateVehicle
): Promise<
  VehicleResponse<Vehicle | null>
> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error(
        "User not authenticated."
      );
    }

    const updateData: UpdateVehicle = {
      ...vehicle,
    };

    /**
     * Normalize vehicle number.
     */
    if (
      typeof updateData.vehicle_number ===
      "string"
    ) {
      updateData.vehicle_number =
        updateData.vehicle_number
          .toUpperCase()
          .trim();
    }

    /**
     * Normalize text fields.
     */
    if (
      typeof updateData.brand ===
      "string"
    ) {
      updateData.brand =
        updateData.brand.trim();
    }

    if (
      typeof updateData.model ===
      "string"
    ) {
      updateData.model =
        updateData.model.trim();
    }

    if (
      typeof updateData.color ===
      "string"
    ) {
      updateData.color =
        updateData.color.trim();
    }

    if (
      typeof updateData.nickname ===
      "string"
    ) {
      updateData.nickname =
        updateData.nickname.trim();
    }

    if (
      typeof updateData.phone ===
      "string"
    ) {
      updateData.phone =
        updateData.phone.trim();
    }

    if (
      typeof updateData.whatsapp ===
      "string"
    ) {
      updateData.whatsapp =
        updateData.whatsapp.trim();
    }

    const { data, error } = await supabase
      .from("vehicles")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
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
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error:
        err?.message ??
        "Failed to update vehicle.",
    };
  }
}

/**
 * Delete Vehicle
 *
 * Only allows the authenticated owner
 * to delete their own vehicle.
 */
export async function deleteVehicle(
  id: string
): Promise<VehicleResponse<null>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error(
        "User not authenticated."
      );
    }

    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error:
        err?.message ??
        "Failed to delete vehicle.",
    };
  }
}

/**
 * Get Vehicle Count
 *
 * Returns the number of vehicles
 * belonging to the current user.
 */
export async function getVehicleCount(): Promise<number> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return 0;
    }

    const { count, error } = await supabase
      .from("vehicles")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return count ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Check if Vehicle Number Already Exists
 *
 * Checks only inside the current user's
 * vehicles.
 */
export async function vehicleExists(
  vehicleNumber: string
): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return false;
    }

    const normalizedNumber =
      vehicleNumber
        .toUpperCase()
        .trim();

    const { count, error } =
      await supabase
        .from("vehicles")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "vehicle_number",
          normalizedNumber
        )
        .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Get Public Vehicle
 *
 * Used by the QR verification page.
 *
 * This retrieves:
 *
 * 1. Public vehicle identity
 * 2. Owner contact permissions
 * 3. Emergency contact information
 *
 * The owner's user_id is NOT returned
 * in the final PublicVehicle object.
 */
export async function getPublicVehicle(
  id: string
): Promise<
  VehicleResponse<PublicVehicle | null>
> {
  try {
    /**
     * -----------------------------------------
     * GET VEHICLE
     * -----------------------------------------
     */

    const {
      data: vehicle,
      error: vehicleError,
    } = await supabase
      .from("vehicles")
      .select(
        `
        id,
        user_id,
        vehicle_number,
        brand,
        model,
        year,
        color,
        nickname,
        phone,
        whatsapp
        `
      )
      .eq("id", id)
      .maybeSingle();

    if (vehicleError) {
      throw vehicleError;
    }

    if (!vehicle) {
      return {
        success: false,
        data: null,
        error: "Vehicle not found.",
      };
    }

    /**
     * -----------------------------------------
     * GET OWNER PROFILE
     * -----------------------------------------
     *
     * We use vehicle.user_id to find
     * the profile belonging to the owner.
     */

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        `
        emergency_name,
        emergency_phone,
        allow_call,
        allow_whatsapp,
        allow_sms,
        allow_emergency,
        allow_location_share
        `
      )
      .eq("id", vehicle.user_id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    /**
     * -----------------------------------------
     * BUILD PUBLIC VEHICLE
     * -----------------------------------------
     */

    const publicVehicle: PublicVehicle = {
      id: vehicle.id,

      vehicle_number:
        vehicle.vehicle_number,

      brand:
        vehicle.brand,

      model:
        vehicle.model,

      year:
        vehicle.year,

      color:
        vehicle.color,

      nickname:
        vehicle.nickname ?? null,

      phone:
        vehicle.phone ?? "",

      whatsapp:
        vehicle.whatsapp ?? "",

      emergency_name:
        profile?.emergency_name || null,

      emergency_phone:
        profile?.emergency_phone || null,

      allow_call:
        profile?.allow_call ?? true,

      allow_whatsapp:
        profile?.allow_whatsapp ?? true,

      allow_sms:
        profile?.allow_sms ?? true,

      allow_emergency:
        profile?.allow_emergency ?? true,

      allow_location_share:
        profile?.allow_location_share ?? true,
    };

    return {
      success: true,
      data: publicVehicle,
      error: null,
    };
  } catch (err: any) {
    console.error(
      "Public vehicle error:",
      err
    );

    return {
      success: false,
      data: null,
      error:
        err?.message ??
        "Unable to load public vehicle.",
    };
  }
}