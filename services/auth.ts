import { supabase } from "@/lib/supabase";

export interface AuthResponse {
  success: boolean;
  error: string | null;
}

const LEGAL_VERSION = "2026-08-31";

export async function registerUser(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResponse> {
  try {
    const legalAcceptedAt = new Date().toISOString();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,

          // Legal consent
          terms_accepted: true,
          privacy_accepted: true,
          legal_version: LEGAL_VERSION,
          legal_accepted_at: legalAcceptedAt,
        },
      },
    });

    if (error) throw error;

    return {
      success: true,
      error: null,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Unable to create your account.",
    };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) throw error;

    return {
      success: true,
      error: null,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Unable to sign in.",
    };
  }
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export function onAuthStateChange(
  callback: Parameters<
    typeof supabase.auth.onAuthStateChange
  >[0]
) {
  return supabase.auth.onAuthStateChange(callback);
}