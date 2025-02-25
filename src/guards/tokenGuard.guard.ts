import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class TokenGuard implements CanActivate {
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authorization = request.headers.authorization;
        const origin = request.headers.origin;
        const apiToken = this.configService.get<string>("API_TOKEN");
        const frontToken = this.configService.get<string>("FRONT_TOKEN");
        const frontUrl = this.configService.get<string>("FRONT_URL");

        if (
            apiToken &&
            frontToken &&
            frontUrl &&
            authorization?.includes("Bearer")
        ) {
            if (authorization.includes(apiToken)) {
                return true;
            }
            if (
                authorization.includes(frontToken) &&
                origin?.includes(frontUrl)
            ) {
                return true;
            }
        }

        return false;
    }
}
