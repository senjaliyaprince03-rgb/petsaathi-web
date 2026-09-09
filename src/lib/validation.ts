import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().nullish(),
  role: z.enum(["PARENT", "SITTER"]).optional().default("PARENT"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const createPetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.string().default("Dog"),
  breed: z.string().nullish(),
  age: z.number().int().nullish(),
  weight: z.number().nullish(),
  vaccinationStatus: z.string().nullish(),
  medicalConditions: z.string().nullish(),
  behaviorNotes: z.string().nullish(),
  biteHistory: z.boolean().default(false),
  escapeHistory: z.boolean().default(false),
  feedingInstructions: z.string().nullish(),
  walkingInstructions: z.string().nullish(),
  vetContact: z.string().nullish(),
});
export type CreatePetInput = z.infer<typeof createPetSchema>;

export const updatePetSchema = createPetSchema.partial();
export type UpdatePetInput = z.infer<typeof updatePetSchema>;

export const bookingStatusEnum = z.enum([
  "NEW_LEAD",
  "CONTACTED",
  "PET_DETAILS_PENDING",
  "SITTER_MATCHING",
  "SITTER_ASSIGNED",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "SERVICE_STARTED",
  "SERVICE_COMPLETED",
  "REPORT_SENT",
  "REVIEW_REQUESTED",
  "CLOSED",
  "CANCELLED",
  "REFUNDED",
]);
export type BookingStatusType = z.infer<typeof bookingStatusEnum>;

export const createBookingSchema = z.object({
  serviceType: z.enum(["WALKING", "SITTING", "BOARDING"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().nullish(),
  totalPrice: z.number().nullish(),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = z.object({
  status: bookingStatusEnum.optional(),
  sitterId: z.string().nullish(),
  totalPrice: z.number().nullish(),
  sitterPayout: z.number().nullish(),
});
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

export const createPaymentOrderSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  amount: z.number().positive("Amount must be positive"),
});
export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;

export const verifyPaymentSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  razorpayOrderId: z.string().min(1, "Razorpay order ID is required"),
  razorpayPaymentId: z.string().min(1, "Razorpay payment ID is required"),
  razorpaySignature: z.string().optional(),
});
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

export const createReportSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  foodAndWater: z.string().nullish(),
  toiletInfo: z.string().nullish(),
  mood: z.string().nullish(),
  behavior: z.string().nullish(),
  healthConcern: z.string().nullish(),
  sitterNote: z.string().nullish(),
  actualStartTime: z.string().nullish(),
  actualEndTime: z.string().nullish(),
  distance: z.number().nullish(),
});
export type CreateReportInput = z.infer<typeof createReportSchema>;

export interface FormattedError {
  field: string;
  message: string;
}

export function formatErrors(error: z.ZodError): FormattedError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
  }));
}

export type ValidateBodyResult<T> =
  | { success: true; data: T }
  | { success: false; errors: FormattedError[] };

export function validateBody<T extends z.ZodTypeAny>(
  schema: T,
  body: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: FormattedError[] } {
  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      success: false,
      errors: formatErrors(result.error),
    };
  }
  return {
    success: true,
    data: result.data,
  };
}
