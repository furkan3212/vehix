import { supabase } from "@/lib/supabase";
import {
  Profile,
  ProfileResponse,
  UpdateProfile,
} from "@/types/profile";

/**
 * Get current logged in user
 */
async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

/**
 * Create profile if it doesn't exist
 */
export async function createProfile(): Promise<
  ProfileResponse<Profile | null>
> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not logged in.",
      };
    }

    const { data: existing } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (existing) {
      return {
        success: true,
        data: existing,
        error: null,
      };
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name: "",
        phone: "",
        whatsapp: "",
        emergency_name: "",
        emergency_phone: "",
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      error: null,
    };
  } catch (err: unknown) {
    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Unknown error",
    };
  }
}
/**
 * Get current user's profile
 */
export async function getProfile(): Promise<
  ProfileResponse<Profile | null>
> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        data: null,
        error: "User not logged in.",
      };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (err: unknown) {
    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to load profile.",
    };
  }
}

/**
 * Get profile or create one automatically
 * if the logged-in user doesn't have one yet.
 */
export async function getOrCreateProfile(): Promise<
  ProfileResponse<Profile | null>
> {
  try {
    const profileResult = await getProfile();

    if (!profileResult.success) {
      return profileResult;
    }

    // Profile already exists
    if (profileResult.data) {
      return profileResult;
    }

    // Profile doesn't exist yet
    return await createProfile();
  } catch (err: unknown) {
    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to get or create profile.",
    };
  }
}
/**
 * Update Profile
 */
export async function updateProfile(
  profile: UpdateProfile
): Promise<ProfileResponse<Profile | null>> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        data: null,
        error: "User not logged in.",
      };
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        whatsapp: profile.whatsapp,
        emergency_name: profile.emergency_name,
        emergency_phone: profile.emergency_phone,

        allow_call: profile.allow_call,
        allow_whatsapp: profile.allow_whatsapp,
        allow_sms: profile.allow_sms,
        allow_emergency: profile.allow_emergency,
        allow_location_share:
          profile.allow_location_share,

        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      error: null,
    };
  } catch (err: unknown) {
    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to update profile.",
    };
  }
}