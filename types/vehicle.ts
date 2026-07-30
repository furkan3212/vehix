/**
 * Vehix Vehicle Model
 * Used across the entire application.
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

  phone: string;

  whatsapp: string;
}

/**
 * Standard API response.
 */
export interface VehicleResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}