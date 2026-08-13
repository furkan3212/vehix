import { supabase } from "@/lib/supabase";

import {
  Profile,
  ProfileResponse,
  UpdateProfile,
} from "@/types/profile";

/**
 * Get the currently authenticated user.
 *
 * We first check the persisted session and then verify
 * the user with getUser().
 *
 * This is more reliable immediately after login or
 * when the browser restores an existing Supabase session.
 */
async function getCurrentUser() {
  try {
    // First check the persisted browser session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error(
        "Supabase session error:",
        sessionError
      );
    }

    if (session?.user) {
      return session.user;
    }

    // Fallback: ask Supabase for the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(
        "Supabase user error:",
        userError
      );
    }

    return user ?? null;
  } catch (error) {
    console.error(
      "Authentication check failed:",
      error
    );

    return null;
  }
}

/**
 * Get current logged-in user's ID.
 */
async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();

  return user?.id ?? null;
}

/**
 * Create a profile for the current user.
 */
export async function createProfile(): Promise<
  ProfileResponse<Profile | null>
> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not logged in.",
      };
    }

    /**
     * Check whether the profile already exists.
     */
    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing) {
      return {
        success: true,
        data: existing,
        error: null,
      };
    }

    /**
     * Create the profile.
     */
    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email ?? "",
        full_name:
          user.user_metadata?.full_name ?? "",

        phone: "",
        whatsapp: "",

        // Emergency Contact
        emergency_name: "",
        emergency_phone: "",

        // Contact permissions
        allow_call: true,
        allow_whatsapp: true,
        allow_sms: true,
        allow_emergency: true,
        allow_location_share: true,
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
      "Create profile error:",
      err
    );

    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Unable to create profile.",
    };
  }
}

/**
 * Get the current user's profile.
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

    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
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
    console.error(
      "Get profile error:",
      err
    );

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
 * Get the current user's profile.
 *
 * If no profile exists, create one automatically.
 */
export async function getOrCreateProfile(): Promise<
  ProfileResponse<Profile | null>
> {
  try {
    /**
     * Make sure authentication exists first.
     */
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not logged in.",
      };
    }

    /**
     * Look for existing profile.
     */
    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    /**
     * Existing profile.
     */
    if (existing) {
      return {
        success: true,
        data: existing,
        error: null,
      };
    }

    /**
     * No profile → create it.
     */
    return await createProfile();
  } catch (err: unknown) {
    console.error(
      "Get/create profile error:",
      err
    );

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
 * Update current user's profile.
 */
export async function updateProfile(
  profile: UpdateProfile
): Promise<ProfileResponse<Profile | null>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not logged in.",
      };
    }

    /**
     * Make sure a profile exists before updating.
     */
    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    /**
     * If the profile doesn't exist, create it first.
     */
    if (!existing) {
      const created = await createProfile();

      if (!created.success) {
        return created;
      }
    }

    /**
     * Update profile.
     */
    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,

        phone: profile.phone,
        whatsapp: profile.whatsapp,

        // Emergency Contact
        emergency_name:
          profile.emergency_name,

        emergency_phone:
          profile.emergency_phone,

        // Contact permissions
        allow_call:
          profile.allow_call,

        allow_whatsapp:
          profile.allow_whatsapp,

        allow_sms:
          profile.allow_sms,

        allow_emergency:
          profile.allow_emergency,

        allow_location_share:
          profile.allow_location_share,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", user.id)
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
      "Update profile error:",
      err
    );

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