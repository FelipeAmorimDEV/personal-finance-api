import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { AuthenticateUserUseCase } from "@/domain/application/usecases/authenticate-user";
import { Public } from "@/infra/auth/public";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateUser.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}

