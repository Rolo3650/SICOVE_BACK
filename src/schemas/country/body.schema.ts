import { Country } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional } from "../general.schema";

type SafeCountry = NullableToOptional<
    Omit<Country, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateCountrySchema = z.object({
    country: z.string(),
}) satisfies z.ZodType<SafeCountry>;

const UpdateCountrySchema = CreateCountrySchema.partial();

type CreateCountry = z.infer<typeof CreateCountrySchema>;
type UpdateCountry = z.infer<typeof UpdateCountrySchema>;

export { CreateCountrySchema, UpdateCountrySchema };
export type { CreateCountry, UpdateCountry };
