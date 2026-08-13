/**
 * Vehix Vehicle Model
 * Used across the application.
 */

export interface Vehicle {
  id: string;

  user_id: string;

  vehicle_number: string;

  brand: string;

  model: string;

  year: number;

  color: string;

  nickname: string | null;

  phone: string;

  whatsapp: string;

  created_at: string;
}

/**
 * Public Vehicle Model
 *
 * Used by the QR verification page.
 *
 * This contains only information that
 * the public QR experience needs.
 */
export interface PublicVehicle {
  id: string;

  vehicle_number: string;

  brand: string;

  model: string;

  year: number;

  color: string;

  nickname: string | null;

  phone: string;

  whatsapp: string;

  emergency_name: string | null;

  emergency_phone: string | null;

  allow_call: boolean;

  allow_whatsapp: boolean;

  allow_sms: boolean;

  allow_emergency: boolean;

  allow_location_share: boolean;
}

/**
 * Data required when creating a vehicle.
 */
export interface CreateVehicle {
  vehicle_number: string;

  brand: string;

  model: string;

  year: number;

  color: string;

  nickname?: string | null;

  phone: string;

  whatsapp: string;
}

/**
 * Data allowed when updating a vehicle.
 */
export interface UpdateVehicle {
  vehicle_number?: string;

  brand?: string;

  model?: string;

  year?: number;

  color?: string;

  nickname?: string | null;

  phone?: string;

  whatsapp?: string;
}

/**
 * Standard API response.
 */
export interface VehicleResponse<T> {
  success: boolean;

  data: T;

  error: string | null;
}