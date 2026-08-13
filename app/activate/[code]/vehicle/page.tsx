"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  Loader2,
  QrCode,
  ShieldCheck,
  Upload,
  Phone,
  UserRound,
} from "lucide-react";

type QRData = {
  id: string;
  qr_code: string;
  status: string;
  product_name: string | null;
  design_name: string | null;
  assigned_user_id: string | null;
  vehicle_id: string | null;
};

export default function VehicleActivationPage() {
  const params = useParams();
  const router = useRouter();

  const code = params.code as string;

  const [qr, setQr] = useState<QRData | null>(null);

  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Vehicle details */
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [colour, setColour] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  /* Emergency contact */
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  /*
   * Load QR information
   */
  useEffect(() => {
    const loadQR = async () => {
      try {
        setLoading(true);
        setError("");

        if (!code) {
          setError("Invalid QR code.");
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace(`/login?redirect=/activate/${code}/vehicle`);
          return;
        }

        const { data, error: qrError } = await supabase
          .from("qr_inventory")
          .select(
            `
              id,
              qr_code,
              status,
              product_name,
              design_name,
              assigned_user_id,
              vehicle_id
            `
          )
          .eq("qr_code", code)
          .maybeSingle();

        if (qrError) {
          console.error("QR lookup error:", qrError);
          setError("Unable to verify this Vehix QR.");
          return;
        }

        if (!data) {
          setError("This Vehix QR code does not exist.");
          return;
        }

        setQr(data);
      } catch (err) {
        console.error("QR loading error:", err);
        setError("Something went wrong while checking the QR.");
      } finally {
        setLoading(false);
      }
    };

    loadQR();
  }, [code, router]);

  /*
   * Handle vehicle photo
   */
  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPhotoFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Vehicle photo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setPhotoFile(file);
  };

  /*
   * Validate emergency phone number
   */
  const validateEmergencyPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");

    /*
     * Indian mobile number:
     * 10 digits beginning with 6, 7, 8 or 9
     *
     * We also allow +91XXXXXXXXXX
     */
    if (cleaned.length === 10) {
      return /^[6-9]\d{9}$/.test(cleaned);
    }

    if (cleaned.length === 12 && cleaned.startsWith("91")) {
      return /^[6-9]\d{9}$/.test(cleaned.slice(2));
    }

    return false;
  };

  /*
   * Normalize emergency phone
   */
  const normalizePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 12 && cleaned.startsWith("91")) {
      return `+${cleaned}`;
    }

    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }

    return phone.trim();
  };

  /*
   * Activate Vehix QR
   */
  const handleActivation = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (activating) return;

    setError("");
    setSuccess("");

    /*
     * Basic vehicle validation
     */
    if (!vehicleNumber.trim()) {
      setError("Please enter your vehicle registration number.");
      return;
    }

    if (!brand.trim()) {
      setError("Please enter your vehicle brand.");
      return;
    }

    if (!model.trim()) {
      setError("Please enter your vehicle model.");
      return;
    }

    if (!colour.trim()) {
      setError("Please enter your vehicle colour.");
      return;
    }

    if (!vehicleType) {
      setError("Please select your vehicle type.");
      return;
    }

    /*
     * Emergency contact validation
     */
    if (!emergencyName.trim()) {
      setError("Please enter your emergency contact name.");
      return;
    }

    if (emergencyName.trim().length < 2) {
      setError(
        "Emergency contact name must contain at least 2 characters."
      );
      return;
    }

    if (!emergencyPhone.trim()) {
      setError("Please enter your emergency contact number.");
      return;
    }

    if (!validateEmergencyPhone(emergencyPhone)) {
      setError(
        "Please enter a valid Indian mobile number."
      );
      return;
    }

    if (!qr) {
      setError("Unable to verify the Vehix QR.");
      return;
    }

    /*
     * Client-side status check
     *
     * The database function performs the REAL security check.
     * This is only for a better user experience.
     */
    if (qr.status !== "sold") {
      if (qr.status === "available") {
        setError(
          "This QR has not been sold yet. Please contact Vehix."
        );
      } else if (qr.status === "activated") {
        setError(
          "This QR has already been activated."
        );
      } else {
        setError(
          "This QR cannot currently be activated."
        );
      }

      return;
    }

    try {
      setActivating(true);

      /*
       * Make sure the user is still logged in.
       */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace(
          `/login?redirect=/activate/${code}/vehicle`
        );
        return;
      }

      /*
       * Save emergency contact to profile first.
       *
       * IMPORTANT:
       * This assumes profiles.id = auth.users.id.
       */
      const normalizedEmergencyPhone =
        normalizePhone(emergencyPhone);

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            emergency_name: emergencyName.trim(),
            emergency_phone: normalizedEmergencyPhone,
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        console.error(
          "Emergency profile update error:",
          profileError
        );

        setError(
          "Unable to save your emergency contact. Please try again."
        );

        return;
      }

      /*
       * Call secure Supabase RPC.
       *
       * The database function:
       *
       * 1. Checks authentication
       * 2. Locks the QR row
       * 3. Checks that QR is SOLD
       * 4. Creates the vehicle
       * 5. Links QR to user
       * 6. Links QR to vehicle
       * 7. Changes SOLD → ACTIVATED
       */
      const { data, error: rpcError } =
        await supabase.rpc(
          "activate_vehix_qr",
          {
            p_qr_code: qr.qr_code,
            p_vehicle_number:
              vehicleNumber.trim().toUpperCase(),
            p_brand: brand.trim(),
            p_model: model.trim(),
            p_colour: colour.trim(),
            p_vehicle_type: vehicleType,
            p_photo_url: null,
          }
        );

      if (rpcError) {
        console.error(
          "Activation RPC error:",
          rpcError
        );

        const message =
          rpcError.message || "Activation failed.";

        if (
          message
            .toLowerCase()
            .includes("already been activated")
        ) {
          setError(
            "This QR has already been activated."
          );
        } else if (
          message
            .toLowerCase()
            .includes("not been sold")
        ) {
          setError(
            "This QR has not been sold yet."
          );
        } else if (
          message
            .toLowerCase()
            .includes("must be logged in")
        ) {
          setError(
            "Please log in before activating your Vehix QR."
          );
        } else {
          setError(message);
        }

        return;
      }

      console.log(
        "Vehix activation successful:",
        data
      );

      setSuccess(
        "Your Vehix QR has been successfully activated!"
      );

      /*
       * Get vehicle ID returned by the RPC.
       */
      const vehicleId =
        data?.vehicle_id ||
        data?.vehicleId ||
        null;

      /*
       * Give Supabase a tiny moment to finish
       * the database update before navigation.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      /*
       * Redirect to the newly created vehicle.
       */
      if (vehicleId) {
        router.replace(
          `/vehicle/${vehicleId}`
        );
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error(
        "Activation error:",
        err
      );

      setError(
        "Something went wrong while activating your Vehix QR."
      );
    } finally {
      setActivating(false);
    }
  };

  /*
   * Loading screen
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
            <QrCode
              size={34}
              className="animate-pulse text-blue-400"
            />
          </div>

          <h1 className="text-xl font-bold">
            Verifying Vehix QR
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Please wait while we verify your official QR.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Error screen
   */
  if (error && !qr) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white/[0.04] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <QrCode
              size={34}
              className="text-red-400"
            />
          </div>

          <h1 className="text-2xl font-black">
            QR Verification Failed
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>
      </main>
    );
  }

  /*
   * QR already activated
   */
  if (qr?.status === "activated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-white/[0.04] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <CheckCircle2
              size={36}
              className="text-emerald-400"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Vehix Smart Identity
          </p>

          <h1 className="mt-3 text-3xl font-black">
            QR Already Activated
          </h1>

          <p className="mt-4 text-zinc-400">
            This official Vehix QR is already linked to a
            vehicle and cannot be activated again.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              QR Code
            </p>

            <p className="mt-2 font-mono text-sm font-bold">
              {qr.qr_code}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    );
  }

  /*
   * QR is available but NOT sold
   */
  if (qr?.status === "available") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-amber-500/20 bg-white/[0.04] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
            <ShieldCheck
              size={36}
              className="text-amber-400"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Vehix Smart Identity
          </p>

          <h1 className="mt-3 text-3xl font-black">
            QR Not Sold
          </h1>

          <p className="mt-4 leading-6 text-zinc-400">
            This is an official Vehix QR, but it has not been
            sold yet. Please purchase a Vehix QR before
            activation.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              QR Code
            </p>

            <p className="mt-2 font-mono text-sm font-bold">
              {qr.qr_code}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-emerald-400">
            <ShieldCheck size={17} />
            Authentic Vehix QR
          </div>
        </div>
      </main>
    );
  }

  /*
   * Main activation form
   */
  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <ShieldCheck
                size={22}
                className="text-blue-400"
              />
            </div>

            <div>
              <p className="text-sm font-bold">
                Vehix
              </p>

              <p className="text-xs text-zinc-500">
                Smart Vehicle Identity
              </p>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl md:p-10">

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
              <Car
                size={30}
                className="text-blue-400"
              />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Vehix Smart Identity
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              Add Your Vehicle
            </h1>

            <p className="mt-3 max-w-2xl leading-6 text-zinc-400">
              Add your vehicle details to activate your official
              Vehix Smart Identity.
            </p>
          </div>

          {/* QR information */}
          <section className="mb-8 rounded-3xl border border-blue-500/20 bg-blue-500/[0.04] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <QrCode
                    size={25}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Official Vehix QR
                  </p>

                  <p className="mt-1 font-mono text-sm font-bold">
                    {qr?.qr_code}
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                Sold
              </div>

            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm leading-6 text-red-300">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={20}
                  className="text-emerald-400"
                />

                <p className="text-sm font-semibold text-emerald-300">
                  {success}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleActivation}
            className="space-y-7"
          >

            {/* Registration */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Vehicle Registration Number
              </label>

              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) =>
                  setVehicleNumber(e.target.value)
                }
                placeholder="MH01AB1234"
                autoComplete="off"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/50 focus:bg-black/30"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Example: MH01AB1234
              </p>
            </div>

            {/* Brand / Model */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Brand
                </label>

                <input
                  type="text"
                  value={brand}
                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
                  placeholder="BMW"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Model
                </label>

                <input
                  type="text"
                  value={model}
                  onChange={(e) =>
                    setModel(e.target.value)
                  }
                  placeholder="Z4"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/50"
                />
              </div>

            </div>

            {/* Colour / Vehicle Type */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Colour
                </label>

                <input
                  type="text"
                  value={colour}
                  onChange={(e) =>
                    setColour(e.target.value)
                  }
                  placeholder="Black"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Vehicle Type
                </label>

                <select
                  value={vehicleType}
                  onChange={(e) =>
                    setVehicleType(e.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition focus:border-blue-500/50"
                >
                  <option value="">
                    Select vehicle type
                  </option>

                  <option value="Car">
                    Car
                  </option>

                  <option value="Bike">
                    Bike
                  </option>

                  <option value="Scooter">
                    Scooter
                  </option>

                  <option value="SUV">
                    SUV
                  </option>

                  <option value="Truck">
                    Truck
                  </option>

                  <option value="Commercial">
                    Commercial
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

            </div>

            {/* Emergency Contact */}
            <section className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-6">

              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                  <Phone
                    size={23}
                    className="text-red-400"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Emergency Contact
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    Add someone we can contact if an emergency
                    occurs involving your vehicle.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Emergency Name */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <UserRound size={15} />
                    Contact Name
                  </label>

                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) =>
                      setEmergencyName(e.target.value)
                    }
                    placeholder="Rahul Sharma"
                    autoComplete="name"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500/50"
                  />
                </div>

                {/* Emergency Phone */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Phone size={15} />
                    Contact Number
                  </label>

                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) =>
                      setEmergencyPhone(e.target.value)
                    }
                    placeholder="9876543210"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={15}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500/50"
                  />

                  <p className="mt-2 text-xs text-zinc-600">
                    Indian mobile number • Example: 9876543210
                  </p>
                </div>

              </div>

              <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs leading-5 text-zinc-500">
                  🔒 Your emergency contact information is kept
                  private and is only used according to your Vehix
                  privacy settings.
                </p>
              </div>

            </section>

            {/* Vehicle photo */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <label className="text-sm font-semibold">
                  Vehicle Photo
                </label>

                <span className="text-xs text-zinc-600">
                  Optional
                </span>
              </div>

              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 py-10 text-center transition hover:border-blue-500/30 hover:bg-blue-500/[0.02]">

                <Upload
                  size={32}
                  className="mb-4 text-zinc-500 transition group-hover:text-blue-400"
                />

                <span className="text-sm font-semibold">
                  {photoFile
                    ? photoFile.name
                    : "Upload vehicle photo"}
                </span>

                <span className="mt-2 text-xs text-zinc-600">
                  JPG, PNG or WEBP • Maximum 5 MB
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

              </label>

              {photoFile && (
                <button
                  type="button"
                  onClick={() => setPhotoFile(null)}
                  className="mt-3 text-xs font-semibold text-red-400 hover:text-red-300"
                >
                  Remove selected photo
                </button>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={activating}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activating ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Activating Your Vehix...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />

                  Activate My Vehix
                </>
              )}
            </button>

            <p className="text-center text-xs leading-5 text-zinc-600">
              Your official QR will be securely linked to the
              vehicle details you provide.
            </p>

          </form>
        </div>
      </div>
    </main>
  );
}