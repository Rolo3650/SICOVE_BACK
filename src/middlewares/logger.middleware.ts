import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction): void {
        const logger = new Logger("Logger");
        logger.debug(
            `
            
    ✔️  New Request 
    
            `,
        );
        if (req.method) {
            console.log("Method:", req.method);
        }
        if (req.originalUrl) {
            console.log("Route:", req.originalUrl);
        }
        if (req.params) {
            console.log("Params:", req.params);
        }
        if (req.query) {
            console.log("Query params:", req.query);
        }
        if (req.body) {
            console.log("Body:", req.body);
        }
        // if (req.headers) {
        //     console.log("Headers", req.headers);
        // }
        if (req.headers.authorization) {
            console.log("Authorization:", req.headers.authorization);
        }
        console.log("");
        next();
    }
}
