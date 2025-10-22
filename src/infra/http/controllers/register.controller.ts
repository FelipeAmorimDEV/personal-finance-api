import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { RegisterUserUseCase } from "@/domain/application/usecases/register-user";
import { Public } from "@/infra/auth/public";

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterBodySchema = z.infer<typeof registerBodySchema>;

@Controller("/accounts")
@Public()
export class RegisterController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerBodySchema))
  async handle(@Body() body: RegisterBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerUser.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      throw new ConflictException("User already exists");
    }

    return {
      message: "User created successfully",
    };
  }
}

