import { Controller, Get, Headers, UnauthorizedException } from "@nestjs/common";
import { Public } from "@/infra/auth/public";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Env } from "@/infra/env";

@Controller("/debug")
@Public()
export class DebugTokenController {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService<Env, true>
  ) {}

  @Get("/token")
  async handle(@Headers("authorization") authorization?: string) {
    if (!authorization) {
      return {
        error: "No authorization header provided",
        expected: "Authorization: Bearer <token>",
      };
    }

    const token = authorization.replace("Bearer ", "");

    try {
      const secret = this.config.get("JWT_SECRET", { infer: true });
      const decoded = this.jwtService.verify(token, { secret });

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;

      return {
        status: "valid",
        decoded,
        expiresIn: `${expiresIn} seconds`,
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
        issuedAt: new Date(decoded.iat * 1000).toISOString(),
        now: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: "invalid",
        error: error.message,
        token: token.substring(0, 20) + "...",
      };
    }
  }
}

