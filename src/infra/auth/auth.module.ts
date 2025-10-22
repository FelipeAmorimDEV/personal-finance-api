import { Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";

import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>): JwtModuleOptions {
        const privateKey = config.get("JWT_SECRET", { infer: true });
      

        return {
          secret: privateKey,
       
        };
      },
    }),
  ],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule {}

