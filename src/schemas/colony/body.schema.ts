import { Colony } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeColony = NullableToOptional<
    Omit<Colony, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateColonySchema = z.object({
    colony: z.string(),
    municipalityId: zObjectId(),
}) satisfies z.ZodType<SafeColony>;

const UpdateColonySchema = CreateColonySchema.partial();

type CreateColony = z.infer<typeof CreateColonySchema>;
type UpdateColony = z.infer<typeof UpdateColonySchema>;

export { CreateColonySchema, UpdateColonySchema };

export type { CreateColony, UpdateColony };
