import { User, UserRole, UserStatus } from "@prisma/client";
import { getEnumPrismaValues } from "src/utils/enum";
import { z } from "zod";
import { NullableToOptional } from "../general.schema";

interface SafeUser
    extends NullableToOptional<
        Omit<
            User,
            "id" | "role" | "userStatus" | "createdAt" | "updatedAt" | "status"
        >
    > {
    role?: UserRole;
    userStatus?: UserStatus;
}

const CreateUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.number(),
    birthday: z.coerce.date(),
    role: z.enum(getEnumPrismaValues(UserRole)).optional(),
    userStatus: z.enum(getEnumPrismaValues(UserStatus)).optional(),
}) satisfies z.ZodType<SafeUser>;

const LoginSchema = z.object({
    email: z.string(),
    password: z.string(),
});

const UpdateUserSchema = CreateUserSchema.omit({
    password: true,
    email: true,
}).partial();

type CreateUser = z.infer<typeof CreateUserSchema>;
type Login = z.infer<typeof LoginSchema>;
type UpdateUser = z.infer<typeof UpdateUserSchema>;

export { LoginSchema, CreateUserSchema, UpdateUserSchema };

export type { Login, CreateUser, UpdateUser };
