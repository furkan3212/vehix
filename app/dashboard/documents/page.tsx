"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Car,
  FileText,
  Upload,
  Eye,
  Trash2,
  CheckCircle2,
  Shield,
} from "lucide-react";

import { getVehicles } from "@/services/vehicle";

import {
  getVehicleDocuments,
  uploadVehicleDocument,
  getDocumentUrl,
  deleteVehicleDocument,
  DocumentType,
  VehicleDocument,
} from "@/services/document";

import { Vehicle } from "@/types/vehicle";

const documentTypes: {
  value: DocumentType;
  label: string;
  description: string;
}[] = [
  {
    value: "rc",
    label: "RC",
    description: "Registration Certificate",
  },
  {
    value: "insurance",
    label: "Insurance",
    description: "Vehicle Insurance",
  },
  {
    value: "puc",
    label: "PUC",
    description: "Pollution Certificate",
  },
  {
    value: "service",
    label: "Service Record",
    description: "Vehicle Service Records",
  },
  {
    value: "other",
    label: "Other",
    description: "Other Vehicle Document",
  },
];

export default function DocumentsPage() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>(
    []
  );

  const [selectedVehicleId, setSelectedVehicleId] =
    useState("");

  const [documents, setDocuments] = useState<
    VehicleDocument[]
  >([]);

  const [documentType, setDocumentType] =
    useState<DocumentType>("rc");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] =
    useState(false);

  const [openingId, setOpeningId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadVehicles() {
    try {
      setLoading(true);
      setError("");

      const result = await getVehicles();

      if (!result.success) {
        setError(
          result.error ??
            "Failed to load vehicles."
        );
        return;
      }

      const vehicleList = result.data ?? [];

      setVehicles(vehicleList);

      if (vehicleList.length > 0) {
        setSelectedVehicleId(vehicleList[0].id);
      }
    } catch (err) {
      console.error(err);

      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  }

  async function loadDocuments(vehicleId: string) {
    if (!vehicleId) {
      setDocuments([]);
      return;
    }

    setError("");
    setSuccess("");

    const result =
      await getVehicleDocuments(vehicleId);

    if (!result.success) {
      setError(
        result.error ??
          "Failed to load documents."
      );

      return;
    }

    setDocuments(result.data ?? []);
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicleId) {
      loadDocuments(selectedVehicleId);
    }
  }, [selectedVehicleId]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);

      event.target.value = "";

      setError(
        "Only PDF, JPG, PNG and WEBP files are allowed."
      );

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);

      event.target.value = "";

      setError(
        "Document size must be 10 MB or less."
      );

      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedVehicleId) {
      setError("Please select a vehicle.");
      return;
    }

    if (!selectedFile) {
      setError("Please choose a document.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const result =
        await uploadVehicleDocument(
          selectedVehicleId,
          documentType,
          selectedFile
        );

      if (!result.success) {
        setError(
          result.error ??
            "Failed to upload document."
        );

        return;
      }

      setSelectedFile(null);

      const fileInput =
        document.getElementById(
          "document-file"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setSuccess(
        "Document uploaded successfully."
      );

      await loadDocuments(selectedVehicleId);
    } catch (err) {
      console.error(err);

      setError("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  }

  async function handleOpenDocument(
    document: VehicleDocument
  ) {
    try {
      setOpeningId(document.id);
      setError("");

      const result =
        await getDocumentUrl(document);

      if (!result.success || !result.data) {
        setError(
          result.error ??
            "Unable to open document."
        );

        return;
      }

      window.open(
        result.data,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error(err);

      setError("Unable to open document.");
    } finally {
      setOpeningId(null);
    }
  }

  async function handleDeleteDocument(
    document: VehicleDocument
  ) {
    const confirmed = window.confirm(
      `Delete "${document.document_name}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(document.id);
      setError("");
      setSuccess("");

      const result =
        await deleteVehicleDocument(
          document
        );

      if (!result.success) {
        setError(
          result.error ??
            "Failed to delete document."
        );

        return;
      }

      setDocuments((current) =>
        current.filter(
          (item) =>
            item.id !== document.id
        )
      );

      setSuccess(
        "Document deleted successfully."
      );
    } catch (err) {
      console.error(err);

      setError("Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatSize(size: number) {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(
      size /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  function getDocumentLabel(
    type: DocumentType
  ) {
    return (
      documentTypes.find(
        (item) => item.value === type
      )?.label ?? "Other"
    );
  }

  const selectedVehicle =
    vehicles.find(
      (vehicle) =>
        vehicle.id === selectedVehicleId
    ) ?? null;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-5 text-zinc-400">
            Loading Documents...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="mb-6 flex items-center gap-2 text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-blue-600/20 p-4">
                <FileText
                  size={32}
                  className="text-blue-400"
                />
              </div>

              <div>
                <h1 className="text-4xl font-black">
                  Vehicle Documents
                </h1>

                <p className="mt-2 text-zinc-500">
                  Securely store and manage your
                  vehicle documents.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
              <Shield size={16} />
              Private & Secure
            </div>
          </div>
        </div>

        {/* No Vehicles */}
        {vehicles.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">
            <Car
              size={56}
              className="mx-auto text-zinc-600"
            />

            <h2 className="mt-6 text-2xl font-bold">
              No Vehicles Found
            </h2>

            <p className="mt-3 text-zinc-500">
              Add a vehicle before uploading
              documents.
            </p>

            <button
              onClick={() =>
                router.push("/add-vehicle")
              }
              className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
            >
              Add Vehicle
            </button>
          </div>
        ) : (
          <>
            {/* Vehicle Selector */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <label className="mb-3 block text-sm font-semibold text-zinc-300">
                Select Vehicle
              </label>

              <select
                value={selectedVehicleId}
                onChange={(event) =>
                  setSelectedVehicleId(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-4 outline-none transition focus:border-blue-500"
              >
                {vehicles.map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {vehicle.vehicle_number} —{" "}
                    {vehicle.brand}{" "}
                    {vehicle.model}
                  </option>
                ))}
              </select>

              {selectedVehicle && (
                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-zinc-800 bg-black/30 p-5">
                  <div className="rounded-xl bg-blue-600/20 p-3">
                    <Car
                      size={24}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <p className="font-bold">
                      {
                        selectedVehicle.vehicle_number
                      }
                    </p>

                    <p className="text-sm text-zinc-500">
                      {selectedVehicle.brand}{" "}
                      {selectedVehicle.model}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="mt-8 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-zinc-900 p-8">
              <div className="flex items-center gap-3">
                <Upload
                  size={27}
                  className="text-blue-400"
                />

                <h2 className="text-2xl font-bold">
                  Upload Document
                </h2>
              </div>

              <p className="mt-3 text-zinc-500">
                PDF, JPG, PNG or WEBP files up to
                10 MB.
              </p>

              <div className="mt-7 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold">
                    Document Type
                  </label>

                  <select
                    value={documentType}
                    onChange={(event) =>
                      setDocumentType(
                        event.target
                          .value as DocumentType
                      )
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-4 outline-none transition focus:border-blue-500"
                  >
                    {documentTypes.map(
                      (type) => (
                        <option
                          key={type.value}
                          value={type.value}
                        >
                          {type.label} —{" "}
                          {type.description}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold">
                    Select File
                  </label>

                  <input
                    id="document-file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={
                      handleFileChange
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white"
                  />
                </div>
              </div>

              {selectedFile && (
                <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      {formatSize(
                        selectedFile.size
                      )}
                    </p>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload size={18} />

                    {uploading
                      ? "Uploading..."
                      : "Upload Document"}
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-400">
                <CheckCircle2 size={20} />
                {success}
              </div>
            )}

            {/* Documents */}
            <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Your Documents
                  </h2>

                  <p className="mt-1 text-zinc-500">
                    {selectedVehicle
                      ? `${selectedVehicle.vehicle_number} documents`
                      : "Vehicle documents"}
                  </p>
                </div>

                <div className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
                  {documents.length}{" "}
                  {documents.length === 1
                    ? "Document"
                    : "Documents"}
                </div>
              </div>

              {documents.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-zinc-700 bg-black/20 p-12 text-center">
                  <FileText
                    size={50}
                    className="mx-auto text-zinc-600"
                  />

                  <h3 className="mt-5 text-xl font-bold">
                    No Documents Yet
                  </h3>

                  <p className="mt-2 text-zinc-500">
                    Upload your RC, insurance, PUC
                    or service records above.
                  </p>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {documents.map(
                    (document) => (
                      <div
                        key={document.id}
                        className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-black/30 p-6 transition hover:border-blue-500/20 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-xl bg-blue-600/20 p-3">
                            <FileText
                              size={25}
                              className="text-blue-400"
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-bold">
                                {
                                  document.document_name
                                }
                              </h3>

                              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                                {getDocumentLabel(
                                  document.document_type
                                )}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-500">
                              <span>
                                {formatSize(
                                  document.file_size
                                )}
                              </span>

                              <span>•</span>

                              <span>
                                {formatDate(
                                  document.created_at
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:flex">
                          <button
                            onClick={() =>
                              handleOpenDocument(
                                document
                              )
                            }
                            disabled={
                              openingId ===
                              document.id
                            }
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Eye size={17} />

                            {openingId ===
                            document.id
                              ? "Opening..."
                              : "View"}
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteDocument(
                                document
                              )
                            }
                            disabled={
                              deletingId ===
                              document.id
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                          >
                            <Trash2 size={17} />

                            {deletingId ===
                            document.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-8 rounded-3xl border border-blue-500/20 bg-blue-500/5 p-7">
              <div className="flex gap-4">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Shield
                    size={22}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <h3 className="font-bold">
                    Your documents are private
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Vehix stores your vehicle documents
                    in a private storage area. Documents
                    are not publicly accessible and can
                    only be opened by the authenticated
                    account that owns them.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}