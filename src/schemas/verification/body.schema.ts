import { Verification } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeVerification = NullableToOptional<
    Omit<Verification, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateVerificationSchema = z.object({
    verificationDate: z.coerce.date(),
    vehicleId: zObjectId(),
}) satisfies z.ZodType<SafeVerification>;

const UpdateVerificationSchema = CreateVerificationSchema.partial();

type CreateVerification = z.infer<typeof CreateVerificationSchema>;
type UpdateVerification = z.infer<typeof UpdateVerificationSchema>;

export { CreateVerificationSchema, UpdateVerificationSchema };

export type { CreateVerification, UpdateVerification };
