import { State } from "@prisma/client";
import { z } from "zod";
import { NullableToOptional, zObjectId } from "../general.schema";

type SafeState = NullableToOptional<
    Omit<State, "id" | "createdAt" | "updatedAt" | "status">
>;

const CreateStateSchema = z.object({
    state: z.string(),
    countryId: zObjectId(),
}) satisfies z.ZodType<SafeState>;

const UpdateStateSchema = CreateStateSchema.partial();

type CreateState = z.infer<typeof CreateStateSchema>;
type UpdateState = z.infer<typeof UpdateStateSchema>;

export { CreateStateSchema, UpdateStateSchema };

export type { CreateState, UpdateState };
