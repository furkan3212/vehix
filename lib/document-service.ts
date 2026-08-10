import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "vehicle-documents";
const SIGNED_URL_EXPIRY = 300; // 5 minutes

export type DocumentType =
  | "RC Book"
  | "Insurance"
  | "PUC Certificate"
  | "Driving Licence"
  | "Vehicle Invoice"
  | "Service History";

export interface VehicleDocument {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: string;
  updated_at: string;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("You must be logged in.");
  }

  return user;
}

/**
 * Upload a new vehicle document.
 */
export async function uploadDocument(
  file: File,
  documentType: DocumentType,
  vehicleId?: string | null
): Promise<VehicleDocument> {
  const user = await getCurrentUser();

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload a PDF, JPG, PNG or WEBP file."
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large. Maximum allowed size is 10 MB.");
  }

  const safeName = sanitizeFileName(file.name);

  if (!safeName) {
    throw new Error("Invalid file name.");
  }

  /*
   * Storage structure:
   *
   * user-id/
   *   vehicle-id/
   *     document-type/
   *       timestamp-file.pdf
   */

  const vehicleFolder = vehicleId || "unassigned";

  const documentFolder = documentType
    .toLowerCase()
    .replace(/\s+/g, "-");

  const filePath =
    `${user.id}/` +
    `${vehicleFolder}/` +
    `${documentFolder}/` +
    `${Date.now()}-${safeName}`;

  // Upload file to private Storage bucket
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error(uploadError.message);
  }

  // Save metadata in database
  const { data, error: databaseError } = await supabase
    .from("vehicle_documents")
    .insert({
      user_id: user.id,
      vehicle_id: vehicleId || null,
      document_type: documentType,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single();

  /*
   * If database insert fails after Storage upload,
   * remove the uploaded file so we don't leave
   * an orphaned Storage file.
   */

  if (databaseError) {
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    console.error("Database insert error:", databaseError);

    throw new Error(databaseError.message);
  }

  return data as VehicleDocument;
}
/**
 * Get all documents belonging to the logged-in owner.
 */
export async function getDocuments(
  vehicleId?: string | null
): Promise<VehicleDocument[]> {
  const user = await getCurrentUser();

  let query = supabase
    .from("vehicle_documents")
    .select("*")
    .eq("user_id", user.id)
    .order("uploaded_at", { ascending: false });

  if (vehicleId) {
    query = query.eq("vehicle_id", vehicleId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Get documents error:", error);
    throw new Error(error.message);
  }

  return (data || []) as VehicleDocument[];
}

/**
 * Get one document by ID.
 */
export async function getDocument(
  documentId: string
): Promise<VehicleDocument> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("vehicle_documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as VehicleDocument;
}

/**
 * Create a temporary signed URL for viewing/downloading
 * a private document.
 */
export async function getDocumentUrl(
  documentId: string,
  download = false
): Promise<string> {
  const document = await getDocument(documentId);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(
      document.file_path,
      SIGNED_URL_EXPIRY,
      {
        download,
      }
    );

  if (error) {
    console.error("Signed URL error:", error);
    throw new Error(error.message);
  }

  if (!data?.signedUrl) {
    throw new Error("Unable to create document URL.");
  }

  return data.signedUrl;
}
/**
 * Delete a document and its actual Storage file.
 */
export async function deleteDocument(
  documentId: string
): Promise<void> {
  const document = await getDocument(documentId);

  // Delete actual file from Storage first
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([document.file_path]);

  if (storageError) {
    console.error("Storage delete error:", storageError);
    throw new Error(storageError.message);
  }

  // Delete database record
  const { error: databaseError } = await supabase
    .from("vehicle_documents")
    .delete()
    .eq("id", document.id)
    .eq("user_id", document.user_id);

  if (databaseError) {
    console.error("Database delete error:", databaseError);
    throw new Error(databaseError.message);
  }
}

/**
 * Replace an existing document with a new file.
 */
export async function replaceDocument(
  documentId: string,
  newFile: File
): Promise<VehicleDocument> {
  const existingDocument = await getDocument(documentId);

  // Validate new file type
  if (!ALLOWED_TYPES.includes(newFile.type)) {
    throw new Error(
      "Invalid file type. Please upload a PDF, JPG, PNG or WEBP file."
    );
  }

  // Validate new file size
  if (newFile.size > MAX_FILE_SIZE) {
    throw new Error(
      "File is too large. Maximum allowed size is 10 MB."
    );
  }

  const user = await getCurrentUser();

  const safeName = sanitizeFileName(newFile.name);

  if (!safeName) {
    throw new Error("Invalid file name.");
  }

  const vehicleFolder =
    existingDocument.vehicle_id || "unassigned";

  const documentFolder = existingDocument.document_type
    .toLowerCase()
    .replace(/\s+/g, "-");

  const newFilePath =
    `${user.id}/` +
    `${vehicleFolder}/` +
    `${documentFolder}/` +
    `${Date.now()}-${safeName}`;

  // Upload replacement
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(newFilePath, newFile, {
      cacheControl: "3600",
      contentType: newFile.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Update database record
  const { data, error: updateError } = await supabase
    .from("vehicle_documents")
    .update({
      file_name: newFile.name,
      file_path: newFilePath,
      file_size: newFile.size,
      mime_type: newFile.type,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingDocument.id)
    .eq("user_id", user.id)
    .select()
    .single();

  // If database update fails,
  // remove newly uploaded file
  if (updateError) {
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([newFilePath]);

    throw new Error(updateError.message);
  }

  // Remove old file after successful database update
  const { error: oldFileError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([existingDocument.file_path]);

  if (oldFileError) {
    console.warn(
      "Replacement succeeded, but old file could not be removed:",
      oldFileError
    );
  }

  return data as VehicleDocument;
}
/**
 * Format file sizes for the UI.
 */
export function formatFileSize(
  bytes: number | null
): string {
  if (!bytes || bytes <= 0) {
    return "0 KB";
  }

  const units = ["Bytes", "KB", "MB", "GB"];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const safeIndex = Math.min(
    index,
    units.length - 1
  );

  const size =
    bytes / Math.pow(1024, safeIndex);

  return `${size.toFixed(
    safeIndex === 0 ? 0 : 1
  )} ${units[safeIndex]}`;
}