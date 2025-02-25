import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { NextFunction } from "express";
import { SafeRequest } from "src/core/express.types";

@Injectable()
export class UserMiddleware implements NestMiddleware {
    private readonly jwtService: JwtService;

    constructor(jwtService: JwtService) {
        this.jwtService = jwtService;
    }

    use(req: SafeRequest, _res: Response, next: NextFunction): void {
        const items = req.headers.authorization?.split(" ");

        if (items?.length === 3) {
            try {
                const user: User = this.jwtService.verify(items[2]);

                req.user = user;
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    throw new ForbiddenException("Token expired");
                }
            }
        } else {
            throw new ForbiddenException("Wrong credential");
        }

        next();
    }
}
