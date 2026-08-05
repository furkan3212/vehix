export interface Profile {
  id: string;

  full_name: string | null;
  email: string | null;

  phone: string | null;
  whatsapp: string | null;

  emergency_name: string | null;
  emergency_phone: string | null;

  allow_call: boolean;
  allow_whatsapp: boolean;
  allow_sms: boolean;
  allow_emergency: boolean;
  allow_location_share: boolean;

  created_at: string;
  updated_at: string;
}

export interface ProfileResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface UpdateProfile {
  full_name: string;
  phone: string;
  whatsapp: string;
  emergency_name: string;
  emergency_phone: string;

  allow_call: boolean;
  allow_whatsapp: boolean;
  allow_sms: boolean;
  allow_emergency: boolean;
  allow_location_share: boolean;
}