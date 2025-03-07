import { ObjectId } from "bson";
import { ZodSchema, z } from "zod";

const zObjectId = (): ZodSchema<string> => {
    return z.string().refine(
        (val): val is string => {
            return ObjectId.isValid(val.toLocaleString());
        },
        {
            message: "Invalid ObjectId",
        },
    );
};

const GeneralIdParamsSchema = z.object({
    id: zObjectId(),
});

type GeneralIdParams = z.infer<typeof GeneralIdParamsSchema>;

export { zObjectId, GeneralIdParamsSchema };
export type { GeneralIdParams };
