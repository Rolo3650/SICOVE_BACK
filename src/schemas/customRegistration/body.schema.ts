import { CustomRegistration } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeCustomRegistration = NullableToOptional<
    Omit<CustomRegistration, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateCustomRegistrationSchema = z.object({
    name: z.string(),
    folio: z.string(),
    date: z.coerce.date(),
    vehicleId: zObjectId(),
}) satisfies z.ZodType<SafeCustomRegistration>;

const UpdateCustomRegistrationSchema = CreateCustomRegistrationSchema.partial();

type CreateCustomRegistration = z.infer<typeof CreateCustomRegistrationSchema>;
type UpdateCustomRegistration = z.infer<typeof UpdateCustomRegistrationSchema>;

export { CreateCustomRegistrationSchema, UpdateCustomRegistrationSchema };

export type { CreateCustomRegistration, UpdateCustomRegistration };
