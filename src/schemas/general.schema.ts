import { ObjectId } from "bson";
import { ZodSchema, z } from "zod";

type NullableToOptional<T> = {
    [P in keyof T as null extends T[P] ? P : never]?: T[P] | undefined;
} & {
    [P in keyof T as null extends T[P] ? never : P]: T[P];
};

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
export type { GeneralIdParams, NullableToOptional };
