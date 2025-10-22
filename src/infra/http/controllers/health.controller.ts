import { Controller, Get } from "@nestjs/common";
import { Public } from "@/infra/auth/public";

@Controller("/health")
@Public()
export class HealthController {
  @Get()
  async handle() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0-with-jwt",
      publicRoutesWorking: true,
    };
  }
}

