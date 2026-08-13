import { supabase } from "@/lib/supabase";

export type DocumentType =
  | "rc"
  | "insurance"
  | "puc"
  | "service"
  | "other";

export interface VehicleDocument {
  id: string;
  user_id: string;
  vehicle_id: string;
  document_type: DocumentType;
  document_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface DocumentResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

/**
 * Get currently authenticated user.
 */
async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(
        "Supabase authentication error:",
        error.message
      );

      return null;
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
 * Verify that the current user owns the vehicle.
 */
async function verifyVehicleOwnership(
  vehicleId: string,
  userId: string
): Promise<boolean> {
  const {
    data,
    error,
  } = await supabase
    .from("vehicles")
    .select("id")
    .eq("id", vehicleId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "Vehicle ownership check error:",
      error.message
    );

    return false;
  }

  return Boolean(data);
}

/**
 * Get all documents belonging to one vehicle.
 */
export async function getVehicleDocuments(
  vehicleId: string
): Promise<
  DocumentResponse<VehicleDocument[]>
> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        data: [],
        error: "User not authenticated.",
      };
    }

    const ownsVehicle =
      await verifyVehicleOwnership(
        vehicleId,
        user.id
      );

    if (!ownsVehicle) {
      return {
        success: false,
        data: [],
        error:
          "You do not have access to this vehicle.",
      };
    }

    const {
      data,
      error,
    } = await supabase
      .from("vehicle_documents")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Supabase get documents error:",
        error.message
      );

      return {
        success: false,
        data: [],
        error: error.message,
      };
    }

    return {
      success: true,
      data:
        (data as VehicleDocument[]) ?? [],
      error: null,
    };
  } catch (err: unknown) {
    console.error(
      "Get vehicle documents error:",
      err
    );

    return {
      success: false,
      data: [],
      error:
        err instanceof Error
          ? err.message
          : "Failed to load documents.",
    };
  }
}

/**
 * Upload a vehicle document.
 */
export async function uploadVehicleDocument(
  vehicleId: string,
  documentType: DocumentType,
  file: File
): Promise<
  DocumentResponse<VehicleDocument | null>
> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not authenticated.",
      };
    }

    const ownsVehicle =
      await verifyVehicleOwnership(
        vehicleId,
        user.id
      );

    if (!ownsVehicle) {
      return {
        success: false,
        data: null,
        error:
          "You do not have permission to upload documents for this vehicle.",
      };
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        data: null,
        error:
          "Only PDF, JPG, PNG and WEBP files are allowed.",
      };
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      return {
        success: false,
        data: null,
        error:
          "Document size must be 10 MB or less.",
      };
    }

    const originalExtension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ?? "file";

    const safeName =
      file.name
        .replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        )
        .replace(
          /\s+/g,
          "_"
        );

    /*
     * Do NOT add the extension again.
     * safeName already contains it.
     */
    const filePath =
      `${user.id}/${vehicleId}/` +
      `${Date.now()}-${safeName}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("vehicle-documents")
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
          contentType:
            file.type ||
            `application/${originalExtension}`,
        }
      );

    if (uploadError) {
      console.error(
        "Supabase storage upload error:",
        uploadError.message
      );

      return {
        success: false,
        data: null,
        error:
          uploadError.message,
      };
    }

    const {
  data,
  error,
} = await supabase
  .from("vehicle_documents")
  .insert({
    user_id: user.id,
    vehicle_id: vehicleId,
    document_type: documentType,

    // Existing database column
    file_name: file.name,

    // Keep our application field as well
    document_name: file.name,

    file_path: filePath,
    file_size: file.size,
    mime_type: file.type,
  })
  .select()
  .single();

    if (error) {
      console.error(
        "Supabase document insert error:",
        error.message
      );

      /*
       * Database insert failed, so remove
       * the uploaded file to prevent orphaned
       * storage files.
       */
      await supabase.storage
        .from("vehicle-documents")
        .remove([filePath]);

      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    return {
      success: true,
      data:
        data as VehicleDocument,
      error: null,
    };
  } catch (err: unknown) {
    console.error(
      "Upload vehicle document error:",
      err
    );

    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to upload document.",
    };
  }
}

/**
 * Create a temporary signed URL.
 */
export async function getDocumentUrl(
  document: VehicleDocument
): Promise<
  DocumentResponse<string | null>
> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not authenticated.",
      };
    }

    if (
      document.user_id !==
      user.id
    ) {
      return {
        success: false,
        data: null,
        error:
          "You do not have access to this document.",
      };
    }

    const {
      data,
      error,
    } = await supabase.storage
      .from("vehicle-documents")
      .createSignedUrl(
        document.file_path,
        60 * 10
      );

    if (error) {
      console.error(
        "Supabase signed URL error:",
        error.message
      );

      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    return {
      success: true,
      data:
        data?.signedUrl ?? null,
      error: null,
    };
  } catch (err: unknown) {
    console.error(
      "Get document URL error:",
      err
    );

    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to open document.",
    };
  }
}

/**
 * Delete a vehicle document.
 */
export async function deleteVehicleDocument(
  document: VehicleDocument
): Promise<
  DocumentResponse<null>
> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not authenticated.",
      };
    }

    if (
      document.user_id !==
      user.id
    ) {
      return {
        success: false,
        data: null,
        error:
          "You do not have access to this document.",
      };
    }

    /*
     * Delete database record first only after
     * confirming ownership.
     */
    const {
      error: databaseError,
    } = await supabase
      .from("vehicle_documents")
      .delete()
      .eq("id", document.id)
      .eq("user_id", user.id);

    if (databaseError) {
      console.error(
        "Supabase document delete error:",
        databaseError.message
      );

      return {
        success: false,
        data: null,
        error:
          databaseError.message,
      };
    }

    /*
     * Remove actual file from storage.
     */
    const {
      error: storageError,
    } = await supabase.storage
      .from("vehicle-documents")
      .remove([
        document.file_path,
      ]);

    if (storageError) {
      console.error(
        "Storage delete warning:",
        storageError.message
      );
    }

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (err: unknown) {
    console.error(
      "Delete vehicle document error:",
      err
    );

    return {
      success: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to delete document.",
    };
  }
}