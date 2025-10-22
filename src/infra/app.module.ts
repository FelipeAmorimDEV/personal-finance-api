import { Module } from '@nestjs/common'
import { HttpModule } from './http/http.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }), 
    HttpModule, 
    DatabaseModule,
    AuthModule
  ],
  providers: [
    Reflector,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
