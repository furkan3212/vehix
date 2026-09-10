import { supabase } from "@/lib/supabase";

export const VEHICLE_FEATURE_KEYS = [
  "digital_identity",
  "public_vehicle_page",
  "vehicle_information",
  "share_vehicle",
  "contact_owner",
  "smart_parking",
  "emergency_mode",
  "theft_assist",
  "document_verification",
  "vehicle_passport",
  "smart_maintenance",
  "scan_activity",
  "notifications",
] as const;

export type VehicleFeatureKey =
  (typeof VEHICLE_FEATURE_KEYS)[number];

export type VehicleFeatureSettings = {
  vehicle_id: string;

  digital_identity: boolean;
  public_vehicle_page: boolean;
  vehicle_information: boolean;
  share_vehicle: boolean;
  contact_owner: boolean;

  smart_parking: boolean;
  emergency_mode: boolean;
  theft_assist: boolean;

  document_verification: boolean;
  vehicle_passport: boolean;
  smart_maintenance: boolean;

  scan_activity: boolean;
  notifications: boolean;

  created_at: string;
  updated_at: string;
};

export type VehicleFeatureSettingsResult = {
  success: boolean;
  data?: VehicleFeatureSettings;
  error?: string;
};

export async function getVehicleFeatureSettings(
  vehicleId: string
): Promise<VehicleFeatureSettingsResult> {
  if (!vehicleId) {
    return {
      success: false,
      error: "Vehicle ID is required.",
    };
  }

  const { data, error } = await supabase
    .from("vehicle_feature_settings")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .maybeSingle();

  if (error) {
    console.error(
      "getVehicleFeatureSettings error:",
      error
    );

    return {
      success: false,
      error: "Unable to load vehicle feature settings.",
    };
  }

  if (!data) {
    return {
      success: false,
      error: "Vehicle feature settings were not found.",
    };
  }

  return {
    success: true,
    data: data as VehicleFeatureSettings,
  };
}

export async function ensureVehicleFeatureSettings(
  vehicleId: string
): Promise<VehicleFeatureSettingsResult> {
  if (!vehicleId) {
    return {
      success: false,
      error: "Vehicle ID is required.",
    };
  }

  const { data, error } = await supabase
    .from("vehicle_feature_settings")
    .upsert(
      {
        vehicle_id: vehicleId,
      },
      {
        onConflict: "vehicle_id",
        ignoreDuplicates: true,
      }
    )
    .select("*")
    .maybeSingle();

  if (error) {
    console.error(
      "ensureVehicleFeatureSettings error:",
      error
    );

    return {
      success: false,
      error: "Unable to initialize vehicle feature settings.",
    };
  }

  if (!data) {
    return getVehicleFeatureSettings(vehicleId);
  }

  return {
    success: true,
    data: data as VehicleFeatureSettings,
  };
}

export async function updateVehicleFeatureSetting(
  vehicleId: string,
  feature: VehicleFeatureKey,
  enabled: boolean
): Promise<VehicleFeatureSettingsResult> {
  if (!vehicleId) {
    return {
      success: false,
      error: "Vehicle ID is required.",
    };
  }

  if (!VEHICLE_FEATURE_KEYS.includes(feature)) {
    return {
      success: false,
      error: "Invalid vehicle feature.",
    };
  }

  const { data, error } = await supabase
    .from("vehicle_feature_settings")
    .update({
      [feature]: enabled,
    })
    .eq("vehicle_id", vehicleId)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error(
      "updateVehicleFeatureSetting error:",
      error
    );

    return {
      success: false,
      error: "Unable to update the vehicle feature setting.",
    };
  }

  if (!data) {
    return {
      success: false,
      error: "Vehicle feature settings were not found.",
    };
  }

  return {
    success: true,
    data: data as VehicleFeatureSettings,
  };
}

export async function updateVehicleFeatureSettings(
  vehicleId: string,
  updates: Partial<
    Pick<VehicleFeatureSettings, VehicleFeatureKey>
  >
): Promise<VehicleFeatureSettingsResult> {
  if (!vehicleId) {
    return {
      success: false,
      error: "Vehicle ID is required.",
    };
  }

  const entries = Object.entries(updates);

  if (entries.length === 0) {
    return {
      success: false,
      error: "No feature settings were provided.",
    };
  }

  for (const [key, value] of entries) {
    if (
      !VEHICLE_FEATURE_KEYS.includes(
        key as VehicleFeatureKey
      ) ||
      typeof value !== "boolean"
    ) {
      return {
        success: false,
        error: "Invalid vehicle feature settings.",
      };
    }
  }

  const { data, error } = await supabase
    .from("vehicle_feature_settings")
    .update(updates)
    .eq("vehicle_id", vehicleId)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error(
      "updateVehicleFeatureSettings error:",
      error
    );

    return {
      success: false,
      error: "Unable to update vehicle feature settings.",
    };
  }

  if (!data) {
    return {
      success: false,
      error: "Vehicle feature settings were not found.",
    };
  }

  return {
    success: true,
    data: data as VehicleFeatureSettings,
  };
}