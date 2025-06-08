import { InsuranceRegistration } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeInsuranceRegistration = NullableToOptional<
    Omit<InsuranceRegistration, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateInsuranceRegistrationSchema = z.object({
    policyNumber: z.string(),
    company: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    policyHolder: z.string(),
    policyCoverage: z.string(),
    vehicleId: zObjectId(),
}) satisfies z.ZodType<SafeInsuranceRegistration>;

const UpdateInsuranceRegistrationSchema =
    CreateInsuranceRegistrationSchema.partial();

type CreateInsuranceRegistration = z.infer<
    typeof CreateInsuranceRegistrationSchema
>;
type UpdateInsuranceRegistration = z.infer<
    typeof UpdateInsuranceRegistrationSchema
>;

export { CreateInsuranceRegistrationSchema, UpdateInsuranceRegistrationSchema };

export type { CreateInsuranceRegistration, UpdateInsuranceRegistration };
