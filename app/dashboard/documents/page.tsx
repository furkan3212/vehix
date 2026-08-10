"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  Upload,
  Shield,
  FileText,
  HardDrive,
  Lock,
  Cloud,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import {
  uploadDocument,
  getDocuments,
  getDocumentUrl,
  deleteDocument,
  type VehicleDocument,
  type DocumentType,
  formatFileSize,
} from "@/lib/document-service";

const DOCUMENT_TYPES: DocumentType[] = [
  "RC Book",
  "Insurance",
  "PUC Certificate",
  "Driving Licence",
  "Vehicle Invoice",
  "Service History",
];

const DOCUMENT_DESCRIPTIONS: Record<DocumentType, string> = {
  "RC Book":
    "Registration Certificate for your vehicle.",
  Insurance:
    "Your active vehicle insurance policy.",
  "PUC Certificate":
    "Pollution Under Control certificate.",
  "Driving Licence":
    "Your driving licence document.",
  "Vehicle Invoice":
    "Original vehicle purchase invoice.",
  "Service History":
    "Vehicle servicing and maintenance records.",
};

const DOCUMENT_COLORS: Record<DocumentType, string> = {
  "RC Book": "text-blue-400",
  Insurance: "text-green-400",
  "PUC Certificate": "text-cyan-400",
  "Driving Licence": "text-yellow-400",
  "Vehicle Invoice": "text-orange-400",
  "Service History": "text-purple-400",
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState<DocumentType | null>(
    null
  );

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentType | null>(null);

  const [showUploadModal, setShowUploadModal] =
    useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /*
   * Load documents belonging to the logged-in user.
   *
   * RLS on Supabase ensures that only the authenticated
   * owner's records can be returned.
   */

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDocuments();

      setDocuments(data);
    } catch (err) {
      console.error("Failed to load documents:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your documents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  /*
   * Open the upload modal for a particular document type.
   */

 const openUploadModal = (
  documentType?: DocumentType
) => {
  setError("");
  setSuccess("");

  if (documentType) {
    setSelectedDocumentType(documentType);
    setShowUploadModal(true);

    /*
     * Let React render the modal first,
     * then open the browser file picker.
     */
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  } else {
    setSelectedDocumentType(null);
    setShowUploadModal(true);
  }
};

  /*
   * Close upload modal.
   */

  const closeUploadModal = () => {
    if (uploading) return;

    setShowUploadModal(false);
    setSelectedDocumentType(null);
    setError("");
  };

  /*
   * Open the actual browser file picker.
   */

  const openFilePicker = () => {
    if (!selectedDocumentType) {
      setError("Please select a document type first.");
      return;
    }

    fileInputRef.current?.click();
  };

  /*
   * Handle selected file and upload it to Supabase.
   */

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    /*
     * Reset input so selecting the same file again
     * will still trigger onChange.
     */

    event.target.value = "";

    if (!file || !selectedDocumentType) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      setUploading(selectedDocumentType);

      await uploadDocument(
        file,
        selectedDocumentType
      );

      setSuccess(
        `${selectedDocumentType} uploaded successfully.`
      );

      await loadDocuments();

      setTimeout(() => {
        setShowUploadModal(false);
        setSelectedDocumentType(null);
        setSuccess("");
      }, 1200);
    } catch (err) {
      console.error("Document upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload the document."
      );
    } finally {
      setUploading(null);
    }
  };

  /*
   * Find a document by its document type.
   */

  const getDocumentByType = (
    documentType: DocumentType
  ) => {
    return documents.find(
      (document) =>
        document.document_type === documentType
    );
  };

  /*
   * Calculate storage usage.
   */

  const totalStorageUsed = documents.reduce(
    (total, document) =>
      total + (document.file_size || 0),
    0
  );

  /*
   * The current UI limit is 15 GB.
   *
   * This is only a display calculation for now.
   * Actual Supabase storage limits depend on your plan.
   */

  const storageLimit = 15 * 1024 * 1024 * 1024;

  const storagePercentage = Math.min(
    (totalStorageUsed / storageLimit) * 100,
    100
  );

  return (
    <main className="min-h-screen bg-[#030712] text-white">

      {/* Background */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[180px]" />

      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Back Button */}

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:border-blue-500/40 hover:bg-blue-500/10"
        >
          <ArrowLeft size={18} />

          Dashboard
        </Link>

        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center"
        >

          <div>

            <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 sm:px-5 sm:text-xs">
              Owner Only
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Vehicle Documents
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Store your important vehicle documents
              securely. Your documents are private and
              accessible only from your authenticated
              Vehix account.
            </p>

          </div>

          <button
            type="button"
            onClick={() => openUploadModal()}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 font-bold shadow-lg shadow-blue-600/20 transition duration-300 hover:scale-[1.02] hover:shadow-blue-500/40 sm:w-auto"
          >
            <Upload
              size={20}
              className="transition group-hover:-translate-y-0.5"
            />

            Upload Document
          </button>

        </motion.div>

        {/* Error Banner */}

        {error && !showUploadModal && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-8 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300"
          >

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm leading-6">
              {error}
            </p>

          </motion.div>
        )}

        {/* Success Banner */}

        {success && !showUploadModal && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-8 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-300"
          >

            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm leading-6">
              {success}
            </p>

          </motion.div>
        )}

        {/* Overview Cards */}

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Security */}

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-3xl"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
              <Shield
                size={30}
                className="text-blue-400"
              />
            </div>

            <h2 className="mt-5 text-3xl font-black">
              100%
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Private Storage
            </p>

          </motion.div>

          {/* Documents */}

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-3xl"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
              <FileText
                size={30}
                className="text-cyan-400"
              />
            </div>

            <h2 className="mt-5 text-3xl font-black">
              {loading ? "—" : documents.length}
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Documents Uploaded
            </p>

          </motion.div>

          {/* Storage */}

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-3xl"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10">
              <HardDrive
                size={30}
                className="text-green-400"
              />
            </div>

            <h2 className="mt-5 text-3xl font-black">
              {loading
                ? "—"
                : formatFileSize(totalStorageUsed)}
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Storage Used
            </p>

          </motion.div>

          {/* Privacy */}

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-3xl"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10">
              <Lock
                size={30}
                className="text-yellow-400"
              />
            </div>

            <h2 className="mt-5 text-3xl font-black">
              Owner
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Access Only
            </p>

          </motion.div>

        </div>

        {/* My Documents */}

        <section className="mt-14">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <h2 className="text-3xl font-black sm:text-4xl">
                My Documents
              </h2>

              <p className="mt-2 text-zinc-400">
                Upload and securely manage your vehicle files.
              </p>

            </div>

            <button
              type="button"
              onClick={() => openUploadModal()}
              className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:border-blue-500/40 hover:bg-white/10 sm:inline-flex"
            >
              <Plus size={18} />

              Add New
            </button>

          </div>

          {/* Document Grid */}

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {DOCUMENT_TYPES.map((documentType, index) => {
          const document = getDocumentByType(documentType);

          const isUploading =
            uploading === documentType;

          return (
            <motion.div
              key={documentType}
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
              }}
              whileHover={{
                y: -6,
              }}
              className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-3xl transition-all duration-500 hover:border-blue-500/30"
            >

              {/* Card Header */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">

                  <FileText
                    size={28}
                    className={
                      DOCUMENT_COLORS[documentType]
                    }
                  />

                </div>

                {document ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-green-400">
                    <CheckCircle2 size={13} />
                    Uploaded
                  </span>
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Not Uploaded
                  </span>
                )}

              </div>

              {/* Title */}

              <h3 className="mt-7 text-2xl font-black">
                {documentType}
              </h3>

              <p className="mt-3 min-h-[56px] text-sm leading-7 text-zinc-400">
                {DOCUMENT_DESCRIPTIONS[documentType]}
              </p>

              {/* File Information */}

              <div className="mt-7 space-y-3">

                <div className="flex items-center justify-between rounded-2xl bg-black/30 px-4 py-3">

                  <span className="text-xs text-zinc-500">
                    File
                  </span>

                  <span className="max-w-[60%] truncate text-right text-xs font-medium text-zinc-300">
                    {document
                      ? document.file_name
                      : "No file"}
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-2xl bg-black/30 px-4 py-3">

                  <span className="text-xs text-zinc-500">
                    Size
                  </span>

                  <span className="text-xs font-medium text-zinc-300">
                    {document
                      ? formatFileSize(
                          document.file_size
                        )
                      : "—"}
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-2xl bg-black/30 px-4 py-3">

                  <span className="text-xs text-zinc-500">
                    Uploaded
                  </span>

                  <span className="text-right text-xs font-medium text-zinc-300">
                    {document
                      ? new Date(
                          document.uploaded_at
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </span>

                </div>

              </div>

              {/* Actions */}

              <div className="mt-7 grid grid-cols-2 gap-3">

                <button
                  type="button"
                 onClick={() => {
  setError("");
  setSuccess("");
  setSelectedDocumentType(documentType);

  setTimeout(() => {
    fileInputRef.current?.click();
  }, 0);
}}
                  disabled={isUploading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3.5 text-sm font-bold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isUploading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />

                      {document
                        ? "Replace"
                        : "Upload"}
                    </>
                  )}

                </button>

                <button
                  type="button"
                  disabled={!document}
                  onClick={() => {
                    if (!document) return;

                    setError("");
                    setSuccess("");

                   getDocumentUrl(document.id)
  .then((url) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  })
  .catch((err) => {
    console.error(err);

    setError(
      err instanceof Error
        ? err.message
        : "Unable to open document."
    );
  });
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold transition hover:border-blue-500/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  View
                </button>

              </div>

            </motion.div>
          );
        })}

      </div>

      {/* Empty State */}

      {!loading && documents.length === 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-8 rounded-[30px] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center sm:p-12"
        >

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">

            <FileText
              size={30}
              className="text-blue-400"
            />

          </div>

          <h3 className="mt-6 text-2xl font-black">
            Your document vault is empty
          </h3>

          <p className="mx-auto mt-3 max-w-lg leading-7 text-zinc-400">
            Start by uploading your RC Book,
            Insurance, PUC or another important
            vehicle document.
          </p>

          <button
            type="button"
            onClick={() => openUploadModal()}
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 font-bold transition hover:scale-[1.02]"
          >

            <Upload size={19} />

            Upload First Document

          </button>

        </motion.div>
      )}

      {/* Loading State */}

      {loading && (
  <div className="mt-8 flex items-center justify-center rounded-[30px] border border-white/10 bg-white/5 py-16">

    <div className="flex items-center gap-3 text-zinc-400">

      <Loader2
        size={22}
        className="animate-spin text-blue-400"
      />

      Loading your documents...

    </div>

  </div>
)}
</section>
            {/* Security & Storage */}

      <div className="mt-14 grid gap-6 xl:grid-cols-2">

        {/* Storage Overview */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-3xl sm:p-8"
        >

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">

              <Cloud
                size={28}
                className="text-blue-400"
              />

            </div>

            <div>

              <h3 className="text-2xl font-black">
                Storage Overview
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Your document storage usage
              </p>

            </div>

          </div>

          <div className="mt-8">

            <div className="flex items-center justify-between text-sm">

              <span className="text-zinc-400">
                Used
              </span>

              <span className="font-semibold">
                {formatFileSize(totalStorageUsed)}
              </span>

            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">

              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${storagePercentage}%`,
                }}
                transition={{
                  duration: 1,
                }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
              />

            </div>

            <div className="mt-3 flex justify-between text-xs text-zinc-500">

              <span>
                {documents.length}{" "}
                {documents.length === 1
                  ? "file"
                  : "files"}
              </span>

              <span>
                {storagePercentage.toFixed(2)}%
              </span>

            </div>

          </div>

        </motion.div>

        {/* Security */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-3xl sm:p-8"
        >

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10">

              <Shield
                size={28}
                className="text-green-400"
              />

            </div>

            <div>

              <h3 className="text-2xl font-black">
                Security Status
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Your documents remain private
              </p>

            </div>

          </div>

          <div className="mt-7 space-y-3">

            <div className="flex items-center justify-between rounded-2xl bg-black/30 px-5 py-4">

              <span className="text-sm text-zinc-400">
                Storage
              </span>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-400">

                <CheckCircle2 size={16} />

                Private

              </span>

            </div>

            <div className="flex items-center justify-between rounded-2xl bg-black/30 px-5 py-4">

              <span className="text-sm text-zinc-400">
                Access
              </span>

              <span className="text-sm font-semibold text-blue-400">
                Owner Only
              </span>

            </div>

            <div className="flex items-center justify-between rounded-2xl bg-black/30 px-5 py-4">

              <span className="text-sm text-zinc-400">
                File Links
              </span>

              <span className="text-sm font-semibold text-green-400">
                Temporary
              </span>

            </div>

          </div>

        </motion.div>

      </div>

      {/* Privacy Banner */}

      <div className="mt-8 rounded-[28px] border border-blue-500/20 bg-blue-500/10 p-6 sm:p-7">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">

            <Lock
              size={23}
              className="text-blue-400"
            />

          </div>

          <div>

            <h3 className="text-lg font-black">
              Your documents stay private
            </h3>

            <p className="mt-2 max-w-4xl text-sm leading-7 text-zinc-400">
              Documents stored here are not part of the
              public vehicle profile. Someone scanning your
              Vehix QR cannot access this vault. Document
              access requires authentication through your
              Vehix account.
            </p>

          </div>

        </div>

      </div>

      {/* Upload Modal */}

      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-[#080d1a] shadow-2xl"
          >

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-white/10 p-6 sm:p-7">

              <div>

                <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                  Secure Upload
                </span>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Upload Document
                </h2>

              </div>

              <button
                type="button"
                onClick={closeUploadModal}
                disabled={!!uploading}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <X size={20} />

              </button>

            </div>

            <div className="p-6 sm:p-7">

              {/* Document Type */}

              <label className="text-sm font-semibold text-zinc-300">
                Document Type
              </label>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

                {DOCUMENT_TYPES.map(
                  (documentType) => {

                    const selected =
                      selectedDocumentType ===
                      documentType;

                    return (
                      <button
                        key={documentType}
                        type="button"
                        disabled={!!uploading}
                        onClick={() => {
                          setSelectedDocumentType(
                            documentType
                          );
                          setError("");
                        }}
                        className={`rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 bg-white/5 hover:border-blue-500/30"
                        }`}
                      >

                        <div className="flex items-center gap-3">

                          <FileText
                            size={20}
                            className={
                              DOCUMENT_COLORS[
                                documentType
                              ]
                            }
                          />

                          <span className="text-sm font-semibold">
                            {documentType}
                          </span>

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

              {/* File Area */}

              <div className="mt-6">

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={handleFileSelected}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={
                    !!uploading ||
                    !selectedDocumentType
                  }
                  className="group flex w-full flex-col items-center justify-center rounded-[26px] border border-dashed border-white/15 bg-white/[0.03] px-6 py-10 text-center transition hover:border-blue-500/40 hover:bg-blue-500/5 disabled:cursor-not-allowed disabled:opacity-40 sm:py-12"
                >

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">

                    {uploading ? (
                      <Loader2
                        size={30}
                        className="animate-spin text-blue-400"
                      />
                    ) : (
                      <Upload
                        size={30}
                        className="text-blue-400 transition group-hover:-translate-y-1"
                      />
                    )}

                  </div>

                  <h3 className="mt-5 text-lg font-bold">

                    {uploading
                      ? "Uploading securely..."
                      : selectedDocumentType
                      ? "Choose a file"
                      : "Select document type first"}

                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">

                    PDF, JPG, PNG or WEBP

                    <br />

                    Maximum file size: 10 MB

                  </p>

                </button>

              </div>

              {/* Modal Error */}

              {error && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">

                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p className="leading-6">
                    {error}
                  </p>

                </div>
              )}

              {/* Modal Success */}

              {success && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">

                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p className="leading-6">
                    {success}
                  </p>

                </div>
              )}

              {/* Selected Document */}

              {selectedDocumentType && (
                <div className="mt-5 rounded-2xl bg-black/30 p-4">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-xs text-zinc-500">
                        Selected document
                      </p>

                      <p className="mt-1 font-semibold">
                        {selectedDocumentType}
                      </p>

                    </div>

                    <FileText
                      size={22}
                      className={
                        DOCUMENT_COLORS[
                          selectedDocumentType
                        ]
                      }
                    />

                  </div>

                </div>
              )}

            </div>

          </motion.div>

        </div>
      )}
            {/* Bottom Information */}

      <div className="mt-10 rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-3xl sm:p-8">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10">

              <Cloud
                size={23}
                className="text-cyan-400"
              />

            </div>

            <div>

              <h3 className="font-bold">
                Secure Vehicle Document Vault
              </h3>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Your documents are stored separately from
                your public vehicle profile.
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-3 text-xs text-zinc-500">

            <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">
              🔒 Private
            </span>

            <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">
              ☁️ Cloud Stored
            </span>

            <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">
              👤 Owner Only
            </span>

          </div>

        </div>

      </div>

      {/* Page Footer */}

      <div className="mt-12 border-t border-white/10 py-8">

        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-zinc-600 sm:flex-row sm:text-left">

          <p>
            © {new Date().getFullYear()} Vehix · Smart Vehicle Identity
          </p>

          <p>
            Your vehicle. Your identity. Your documents.
          </p>

        </div>

      </div>

    </div>

    {/* End of page */}

  </main>
  );
}