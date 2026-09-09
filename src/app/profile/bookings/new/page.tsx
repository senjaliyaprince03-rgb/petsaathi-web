"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ChevronRight,
  Loader2,
  Dog,
  Clock,
  CalendarDays,
  MapPin,
  Building2,
  ShieldCheck,
  Plus,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isAreaActive } from "@/lib/flags";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
}

interface ConfirmedBookingDetails {
  id: string;
  referenceId: string;
  amount: number;
  service: string;
  date: string;
  petName: string;
  location: string;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function NewBooking() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Real pets from API
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [quickPetName, setQuickPetName] = useState("");
  const [quickPetSpecies, setQuickPetSpecies] = useState("Dog");
  const [isAddingQuickPet, setIsAddingQuickPet] = useState(false);

  // First-walk promotional discount
  const [isFirstWalk, setIsFirstWalk] = useState(true);

  // Booking details form
  const [booking, setBooking] = useState({
    petId: "",
    petName: "",
    service: "WALKING",
    date: "",
    duration: "30m",
    instructions: "",
    city: "Ahmedabad",
    area: "Bopal",
    society: "Safal Parisar",
  });

  // Created booking & confirmed payment details
  const [createdBooking, setCreatedBooking] = useState<{ id: string; referenceId: string } | null>(null);
  const [confirmedDetails, setConfirmedDetails] = useState<ConfirmedBookingDetails | null>(null);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?from=/profile/bookings/new");
    }
  }, [status, router]);

  // Set default date to tomorrow at 09:00 AM
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const localIso = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setBooking((prev) => ({ ...prev, date: localIso }));
  }, []);

  // Fetch user's pets and previous bookings
  const fetchData = useCallback(async () => {
    try {
      setLoadingPets(true);

      // Fetch pets
      const petsRes = await fetch("/api/pets");
      if (petsRes.ok) {
        const petsData = await petsRes.json();
        const petList: Pet[] = Array.isArray(petsData)
          ? petsData
          : Array.isArray(petsData.pets)
          ? petsData.pets
          : [];
        setPets(petList);

        if (petList.length > 0) {
          setBooking((prev) => ({
            ...prev,
            petId: petList[0].id,
            petName: petList[0].name,
          }));
        }
      }

      // Check if user has past bookings to determine first-time discount
      const bookingsRes = await fetch("/api/bookings");
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        if (Array.isArray(bookingsData) && bookingsData.length > 0) {
          setIsFirstWalk(false);
        } else {
          setIsFirstWalk(true);
        }
      }
    } catch (err) {
      console.error("Failed to load user pets or bookings:", err);
    } finally {
      setLoadingPets(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, fetchData]);

  // Quick add pet inline
  const handleQuickAddPet = async () => {
    if (!quickPetName.trim()) return;
    setIsAddingQuickPet(true);
    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quickPetName.trim(),
          species: quickPetSpecies,
        }),
      });
      if (res.ok) {
        const newPet: Pet = await res.json();
        setPets((prev) => [...prev, newPet]);
        setBooking((prev) => ({
          ...prev,
          petId: newPet.id,
          petName: newPet.name,
        }));
        setQuickPetName("");
      }
    } catch (err) {
      console.error("Quick add pet error:", err);
    } finally {
      setIsAddingQuickPet(false);
    }
  };

  const getPrice = () => {
    if (booking.service === "WALKING") return isFirstWalk ? 99 : 149;
    if (booking.service === "SITTING") return isFirstWalk ? 249 : 299;
    return 0;
  };

  const getEndDate = (startDate: Date, duration: string) => {
    const end = new Date(startDate.getTime());
    if (duration === "30m") {
      end.setMinutes(end.getMinutes() + 30);
    } else if (duration === "60m") {
      end.setHours(end.getHours() + 1);
    } else if (duration === "overnight") {
      end.setHours(end.getHours() + 12);
    } else {
      end.setHours(end.getHours() + 1);
    }
    return end;
  };

  // Step navigation
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");
    if (step === 1) {
      if (!booking.petName && !booking.petId && quickPetName) {
        setBooking((prev) => ({ ...prev, petName: quickPetName }));
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  // Initialize or retrieve booking record, then create Razorpay order and start payment
  const handleInitiatePayment = async (useSandboxMock = false) => {
    setIsLoading(true);
    setPaymentError("");

    try {
      const startDate = new Date(booking.date);
      const endDate = getEndDate(startDate, booking.duration);
      const locationStr = `${booking.area}${booking.society ? ", " + booking.society : ""}, ${booking.city}`;
      const amount = getPrice();

      // 1. Create booking record in database
      let currentBooking = createdBooking;
      if (!currentBooking) {
        const bookingRes = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceType: booking.service,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            location: locationStr,
            totalPrice: amount,
          }),
        });

        if (!bookingRes.ok) {
          const errData = await bookingRes.json();
          throw new Error(errData.error || "Failed to create booking");
        }

        currentBooking = await bookingRes.json();
        setCreatedBooking(currentBooking);
      }

      if (!currentBooking) {
        throw new Error("Unable to proceed without a valid booking");
      }

      // 2. Create Razorpay Order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: currentBooking.id,
          amount,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || "Failed to initialize payment order");
      }

      const orderData = await orderRes.json();

      // If user chose instant sandbox simulation or Razorpay script fails
      if (useSandboxMock) {
        const mockVerifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: currentBooking.id,
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpaySignature: "mock_signature",
          }),
        });

        if (!mockVerifyRes.ok) {
          throw new Error("Sandbox payment verification failed");
        }

        setConfirmedDetails({
          id: currentBooking.id,
          referenceId: currentBooking.referenceId,
          amount,
          service: booking.service,
          date: booking.date,
          petName: booking.petName || quickPetName || "Pet",
          location: locationStr,
        });
        setIsSuccess(true);
        setIsLoading(false);
        return;
      }

      // 3. Load Razorpay Checkout dynamically
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Could not load payment gateway. You can use sandbox checkout.");
      }

      type RazorpayConstructor = new (options: unknown) => {
        open: () => void;
        on: (event: string, callback: (resp: { error?: { description?: string } }) => void) => void;
      };

      const RazorpayClass = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
      if (!RazorpayClass) {
        throw new Error("Razorpay SDK is not available.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "PetSaathi Care",
        description: `${booking.service} for ${booking.petName || quickPetName || "Pet"}`,
        order_id: orderData.orderId.startsWith("order_mock_") ? undefined : orderData.orderId,
        prefill: {
          name: session?.user?.name || "Pet Parent",
          email: session?.user?.email || "parent@petsaathi.in",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
        handler: async (response: {
          razorpay_order_id?: string;
          razorpay_payment_id?: string;
          razorpay_signature?: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: currentBooking.id,
                razorpayOrderId: response.razorpay_order_id || orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpaySignature: response.razorpay_signature || "mock_signature",
              }),
            });

            if (!verifyRes.ok) {
              const errData = await verifyRes.json();
              throw new Error(errData.error || "Payment verification failed");
            }

            setConfirmedDetails({
              id: currentBooking.id,
              referenceId: currentBooking.referenceId,
              amount,
              service: booking.service,
              date: booking.date,
              petName: booking.petName || quickPetName || "Pet",
              location: locationStr,
            });
            setIsSuccess(true);
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            setPaymentError(
              verifyErr instanceof Error
                ? verifyErr.message
                : "Payment verification failed. Please check with support."
            );
          } finally {
            setIsLoading(false);
          }
        },
      };

      const rzpInstance = new RazorpayClass(options);
      rzpInstance.on("payment.failed", (resp) => {
        setPaymentError(resp.error?.description || "Payment failed. Please try again.");
        setIsLoading(false);
      });

      rzpInstance.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setPaymentError(err instanceof Error ? err.message : "Failed to process payment");
      setIsLoading(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (isSuccess && confirmedDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto glass-card rounded-3xl border border-white/10 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 mb-2">
              Booking Confirmed
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Payment Successful!
            </h2>
            <p className="text-slate-300 mt-2 text-sm sm:text-base max-w-lg mx-auto">
              Your booking reference ID is{" "}
              <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                {confirmedDetails.referenceId}
              </span>
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3 text-sm">
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Service</span>
              <span className="font-bold text-white">{confirmedDetails.service}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Pet</span>
              <span className="font-bold text-white">{confirmedDetails.petName}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Date & Time</span>
              <span className="font-bold text-white">
                {new Date(confirmedDetails.date).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Location</span>
              <span className="font-bold text-white text-right">{confirmedDetails.location}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400 font-medium">Amount Paid</span>
              <span className="font-bold text-emerald-400 text-base">₹{confirmedDetails.amount}</span>
            </div>
          </div>

          <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl text-left text-xs text-primary-200">
            <p className="font-semibold text-primary-300 mb-1">What happens next?</p>
            Our concierge team is matching you with a certified, background-checked sitter in {booking.area}. You will receive sitter details and GPS tracking access.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center bg-white hover:bg-slate-100 text-slate-900 px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/profile"
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Request a Service</h1>
        <p className="text-slate-400 mt-1">Book trusted, certified pet walkers and sitters in Ahmedabad.</p>
      </div>

      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Progress Bar */}
        <div className="bg-white/5 p-6 border-b border-white/10 flex gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 relative">
              <div className="h-2 rounded-full mb-2 bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: step >= s ? "100%" : "0%" }}
                  className="h-full bg-primary-500"
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div
                className={`text-xs font-bold uppercase tracking-wider ${
                  step >= s ? "text-primary-400" : "text-slate-500"
                }`}
              >
                {s === 1 ? "1. Details" : s === 2 ? "2. Review" : "3. Payment"}
              </div>
            </div>
          ))}
        </div>

        {paymentError && (
          <div className="mx-6 md:mx-10 mt-6 p-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{paymentError}</span>
          </div>
        )}

        <form onSubmit={step === 3 ? (e) => e.preventDefault() : handleNextStep} className="p-6 md:p-10 relative">
          <AnimatePresence mode="wait">
            {/* STEP 1: DETAILS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Pet Selection */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-white">Which pet needs care?</label>
                    <Link
                      href="/profile/pets"
                      className="text-xs text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Manage Pets
                    </Link>
                  </div>

                  {loadingPets ? (
                    <div className="p-6 text-center text-slate-400 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-400" /> Loading pets...
                    </div>
                  ) : pets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pets.map((p) => {
                        const isSelected = booking.petId === p.id;
                        return (
                          <label
                            key={p.id}
                            className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "border-primary-500 bg-primary-500/20 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                                : "border-white/10 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <input
                              type="radio"
                              name="pet"
                              className="sr-only"
                              checked={isSelected}
                              onChange={() =>
                                setBooking((prev) => ({
                                  ...prev,
                                  petId: p.id,
                                  petName: p.name,
                                }))
                              }
                            />
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                isSelected
                                  ? "bg-primary-500 text-white"
                                  : "bg-white/10 text-slate-400"
                              }`}
                            >
                              <Dog className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-bold text-white block">{p.name}</span>
                              <span className="text-xs text-slate-400">
                                {p.species} {p.breed ? `• ${p.breed}` : ""}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    /* User has 0 pets - show quick add prompt and input */
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-white">No pet profile found</p>
                          <p className="text-xs text-slate-400">
                            Quickly enter your pet&apos;s name below to continue, or{" "}
                            <Link href="/profile/pets" className="text-primary-400 underline">
                              create a full profile
                            </Link>
                            .
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={quickPetName}
                          onChange={(e) => {
                            setQuickPetName(e.target.value);
                            setBooking((prev) => ({ ...prev, petName: e.target.value }));
                          }}
                          placeholder="Pet's Name (e.g. Bruno)"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <select
                          value={quickPetSpecies}
                          onChange={(e) => setQuickPetSpecies(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 [&>option]:bg-slate-900"
                        >
                          <option value="Dog">Dog</option>
                          <option value="Cat">Cat</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleQuickAddPet}
                          disabled={!quickPetName.trim() || isAddingQuickPet}
                          className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-1"
                        >
                          {isAddingQuickPet ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Service Selection */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-white">Service Type</label>
                    {isFirstWalk && (
                      <span className="text-emerald-400 text-xs bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 font-semibold">
                        <Sparkles className="w-3 h-3" /> First-Time Trial Offer Active!
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* WALKING */}
                    <label
                      className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                        booking.service === "WALKING"
                          ? "border-primary-500 bg-primary-500/20 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Walking</span>
                        <input
                          type="radio"
                          name="service"
                          className="sr-only"
                          checked={booking.service === "WALKING"}
                          onChange={() => setBooking({ ...booking, service: "WALKING" })}
                        />
                      </div>
                      <div className="mt-3 text-xs font-bold text-emerald-400">
                        ₹{isFirstWalk ? "99" : "149"} / walk
                        {isFirstWalk && <span className="line-through text-slate-500 ml-1">₹149</span>}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1">
                        GPS tracked route, pee/poop update, hydration check.
                      </span>
                    </label>

                    {/* SITTING */}
                    <label
                      className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                        booking.service === "SITTING"
                          ? "border-primary-500 bg-primary-500/20 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Sitting</span>
                        <input
                          type="radio"
                          name="service"
                          className="sr-only"
                          checked={booking.service === "SITTING"}
                          onChange={() => setBooking({ ...booking, service: "SITTING" })}
                        />
                      </div>
                      <div className="mt-3 text-xs font-bold text-emerald-400">
                        ₹{isFirstWalk ? "249" : "299"} / session
                        {isFirstWalk && <span className="line-through text-slate-500 ml-1">₹299</span>}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1">
                        At-home care, meal feeding, play session, photo reports.
                      </span>
                    </label>

                    {/* BOARDING (Disabled / Beta) */}
                    <label className="flex flex-col p-4 rounded-xl border border-white/5 bg-white/5 opacity-60 cursor-not-allowed">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold text-slate-400">Boarding</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold uppercase tracking-wider">
                          Beta
                        </span>
                      </div>
                      <Link
                        href="/profile/boarding/waitlist"
                        className="mt-3 text-xs text-primary-400 hover:underline z-10 pointer-events-auto"
                      >
                        Join Waitlist &rarr;
                      </Link>
                    </label>
                  </div>
                </div>

                {/* Area & Society selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white flex justify-between">
                      Service Area
                      {booking.area && !isAreaActive(booking.city, booking.area) && (
                        <span className="text-red-400 text-xs">Currently unavailable in this area</span>
                      )}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                      <select
                        required
                        value={booking.area}
                        onChange={(e) => setBooking({ ...booking, area: e.target.value, society: "" })}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white [&>option]:bg-slate-900 text-sm"
                      >
                        <option value="Bopal">Bopal (Active Launch Area)</option>
                        <option value="Satellite">Satellite</option>
                        <option value="Vastrapur">Vastrapur</option>
                        <option value="Thaltej">Thaltej</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white flex justify-between">
                      Society / Landmark
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                      <select
                        disabled={booking.area !== "Bopal"}
                        value={booking.society}
                        onChange={(e) => setBooking({ ...booking, society: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white disabled:opacity-50 [&>option]:bg-slate-900 text-sm"
                      >
                        <option value="Safal Parisar">Safal Parisar (Priority Sitter Hub)</option>
                        <option value="Orchid Greens">Orchid Greens</option>
                        <option value="Independent House">Independent House / Other</option>
                      </select>
                    </div>
                    {booking.society === "Safal Parisar" && (
                      <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg mt-1 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Society Access Rules Verified
                      </div>
                    )}
                  </div>
                </div>

                {/* Date & Time Picker and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Date & Start Time</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                      <input
                        type="datetime-local"
                        required
                        value={booking.date}
                        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white [&::-webkit-calendar-picker-indicator]:invert text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Duration</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                      <select
                        required
                        value={booking.duration}
                        onChange={(e) => setBooking({ ...booking, duration: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white [&>option]:bg-slate-900 text-sm"
                      >
                        <option value="30m">30 Minutes</option>
                        <option value="60m">60 Minutes</option>
                        <option value="overnight">Overnight Care (12 Hours)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white">
                    Special Instructions <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={booking.instructions}
                    onChange={(e) => setBooking({ ...booking, instructions: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500 resize-none text-sm"
                    placeholder="Gate access code, leash location, dietary preferences, or behavioral tips..."
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: REVIEW */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white">Review Booking Details</h3>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4 text-sm">
                  <div className="flex justify-between pb-3 border-b border-white/10">
                    <span className="text-slate-400">Service</span>
                    <span className="font-bold text-white capitalize">{booking.service.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/10">
                    <span className="text-slate-400">Pet</span>
                    <span className="font-bold text-white">
                      {booking.petName || quickPetName || "Selected Pet"}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/10">
                    <span className="text-slate-400">Date & Time</span>
                    <span className="font-bold text-white">
                      {new Date(booking.date).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/10">
                    <span className="text-slate-400">Duration</span>
                    <span className="font-bold text-white">
                      {booking.duration === "30m"
                        ? "30 Minutes"
                        : booking.duration === "60m"
                        ? "60 Minutes"
                        : "Overnight Care"}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/10">
                    <span className="text-slate-400">Location</span>
                    <span className="font-bold text-white">
                      {booking.area} {booking.society ? `(${booking.society})` : ""}, {booking.city}
                    </span>
                  </div>
                  {booking.instructions && (
                    <div className="flex justify-between pb-1">
                      <span className="text-slate-400">Instructions</span>
                      <span className="font-medium text-slate-300 text-right max-w-xs truncate">
                        {booking.instructions}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-primary-500/20 p-6 rounded-2xl border border-primary-500/30 flex justify-between items-center shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                  <div>
                    <span className="font-bold text-white text-lg block">Payable Amount</span>
                    {isFirstWalk ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> First-Time User Discount Applied
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Standard Service Rate</span>
                    )}
                  </div>
                  <span className="text-4xl font-display font-bold text-primary-400">₹{getPrice()}</span>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT / CHECKOUT */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white">Secure Payment</h3>

                <div className="bg-white/5 p-8 sm:p-10 rounded-3xl border border-white/10 text-center space-y-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 blur-3xl pointer-events-none" />

                  <div className="w-16 h-16 bg-primary-500/10 text-primary-400 rounded-2xl flex items-center justify-center mx-auto border border-primary-500/20 shadow-inner">
                    <CreditCard className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">Razorpay Secure Checkout</h4>
                    <p className="text-slate-400 text-sm mt-1">
                      Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-sm mx-auto flex items-center justify-between text-sm">
                    <span className="text-slate-400">Total Payable:</span>
                    <span className="text-2xl font-display font-bold text-emerald-400">₹{getPrice()}</span>
                  </div>

                  <div className="flex flex-col gap-3 max-w-sm mx-auto pt-2">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleInitiatePayment(false)}
                      className="w-full bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        `Pay ₹${getPrice()} with Razorpay`
                      )}
                    </button>

                    {/* Instant Test Sandbox Flow */}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleInitiatePayment(true)}
                      className="w-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white py-2.5 rounded-xl text-xs font-semibold border border-white/10 transition-colors disabled:opacity-60"
                    >
                      ⚡ Test Sandbox Checkout (Instant Mock Pay)
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wizard Navigation Footer */}
          <div className="mt-10 pt-8 border-t border-white/10 flex justify-between relative z-10">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 && (
              <button
                type="submit"
                disabled={
                  isLoading ||
                  (step === 1 &&
                    (!booking.petId && !booking.petName && !quickPetName)) ||
                  !booking.service ||
                  !booking.date ||
                  !isAreaActive(booking.city, booking.area)
                }
                className="flex items-center bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-sm"
              >
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
