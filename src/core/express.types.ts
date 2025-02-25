import { User } from "@prisma/client";
import { Request } from "express";

interface SafeRequest extends Request {
    user: User | null | undefined;
}

export type { SafeRequest };
