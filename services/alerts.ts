import { supabase } from "@/lib/supabase";

export type AlertType =
  | "lights"
  | "doors"
  | "parking"
  | "emergency";

export interface VehicleAlert {
  id: string;
  vehicle_id: string;
  alert_type: AlertType;
  message: string | null;
  status: "pending" | "sent" | "read";
  created_at: string;
}

export interface CreateAlert {
  vehicle_id: string;
  alert_type: AlertType;
  message?: string;
}

/**
 * Create a vehicle alert.
 *
 * Used by the public QR vehicle page when
 * someone wants to notify the vehicle owner.
 */
export async function createAlert(
  alert: CreateAlert
): Promise<{
  success: boolean;
  data: VehicleAlert | null;
  error: string | null;
}> {
  try {
    if (!alert.vehicle_id) {
      return {
        success: false,
        data: null,
        error: "Vehicle ID is required.",
      };
    }

    if (!alert.alert_type) {
      return {
        success: false,
        data: null,
        error: "Alert type is required.",
      };
    }

    const messages: Record<AlertType, string> = {
      lights:
        "Your vehicle lights may have been left on.",
      doors:
        "A door of your vehicle may be open.",
      parking:
        "Your vehicle may be blocking another vehicle.",
      emergency:
        "Someone has reported an emergency involving your vehicle.",
    };

    const { data, error } = await supabase
      .from("vehicle_alerts")
      .insert({
        vehicle_id: alert.vehicle_id,
        alert_type: alert.alert_type,
        message:
          alert.message ??
          messages[alert.alert_type],
        status: "pending",
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
  } catch (err: unknown) {
    console.error(
      "Create vehicle alert error:",
      err
    );

    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to create vehicle alert.",
    };
  }
}

/**
 * Get alerts for the currently logged-in
 * vehicle owner.
 */
export async function getOwnerAlerts(): Promise<{
  success: boolean;
  data: VehicleAlert[];
  error: string | null;
}> {
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
        data: [],
        error: "User not logged in.",
      };
    }

    /*
     * Only retrieve alerts belonging to
     * vehicles owned by the authenticated user.
     */
    const { data, error } = await supabase
      .from("vehicle_alerts")
      .select(
        `
          id,
          vehicle_id,
          alert_type,
          message,
          status,
          created_at,
          vehicles!inner (
            user_id
          )
        `
      )
      .eq("vehicles.user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    const alerts: VehicleAlert[] =
      (data ?? []).map((item: any) => ({
        id: item.id,
        vehicle_id: item.vehicle_id,
        alert_type: item.alert_type,
        message: item.message,
        status: item.status,
        created_at: item.created_at,
      }));

    return {
      success: true,
      data: alerts,
      error: null,
    };
  } catch (err: unknown) {
    console.error(
      "Get owner alerts error:",
      err
    );

    return {
      success: false,
      data: [],
      error:
        err instanceof Error
          ? err.message
          : "Failed to load alerts.",
    };
  }
}

/**
 * Get alerts for one vehicle.
 *
 * Intended for authenticated vehicle owners.
 */
export async function getVehicleAlerts(
  vehicleId: string
): Promise<{
  success: boolean;
  data: VehicleAlert[];
  error: string | null;
}> {
  try {
    if (!vehicleId) {
      return {
        success: false,
        data: [],
        error: "Vehicle ID is required.",
      };
    }

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
        data: [],
        error: "User not logged in.",
      };
    }

    const { data, error } = await supabase
      .from("vehicle_alerts")
      .select(
        `
          id,
          vehicle_id,
          alert_type,
          message,
          status,
          created_at,
          vehicles!inner (
            user_id
          )
        `
      )
      .eq("vehicle_id", vehicleId)
      .eq("vehicles.user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    const alerts: VehicleAlert[] =
      (data ?? []).map((item: any) => ({
        id: item.id,
        vehicle_id: item.vehicle_id,
        alert_type: item.alert_type,
        message: item.message,
        status: item.status,
        created_at: item.created_at,
      }));

    return {
      success: true,
      data: alerts,
      error: null,
    };
  } catch (err: unknown) {
    console.error(
      "Get vehicle alerts error:",
      err
    );

    return {
      success: false,
      data: [],
      error:
        err instanceof Error
          ? err.message
          : "Failed to load vehicle alerts.",
    };
  }
}

/**
 * Mark an alert as read.
 */
export async function markAlertAsRead(
  alertId: string
): Promise<{
  success: boolean;
  data: VehicleAlert | null;
  error: string | null;
}> {
  try {
    if (!alertId) {
      return {
        success: false,
        data: null,
        error: "Alert ID is required.",
      };
    }

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
        error: "User not logged in.",
      };
    }

    const { data, error } = await supabase
      .from("vehicle_alerts")
      .update({
        status: "read",
      })
      .eq("id", alertId)
      .select(
        `
          id,
          vehicle_id,
          alert_type,
          message,
          status,
          created_at,
          vehicles!inner (
            user_id
          )
        `
      )
      .eq("vehicles.user_id", user.id)
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: {
        id: data.id,
        vehicle_id: data.vehicle_id,
        alert_type: data.alert_type,
        message: data.message,
        status: data.status,
        created_at: data.created_at,
      },
      error: null,
    };
  } catch (err: unknown) {
    console.error(
      "Mark alert as read error:",
      err
    );

    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to update alert.",
    };
  }
}

/**
 * Delete an alert.
 */
export async function deleteAlert(
  alertId: string
): Promise<{
  success: boolean;
  data: null;
  error: string | null;
}> {
  try {
    if (!alertId) {
      return {
        success: false,
        data: null,
        error: "Alert ID is required.",
      };
    }

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
        error: "User not logged in.",
      };
    }

    /*
     * Delete only alerts belonging to
     * the authenticated owner's vehicle.
     */
    const { error } = await supabase
      .from("vehicle_alerts")
      .delete()
      .eq("id", alertId);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (err: unknown) {
    console.error(
      "Delete alert error:",
      err
    );

    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to delete alert.",
    };
  }
}