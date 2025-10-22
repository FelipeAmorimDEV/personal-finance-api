import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../repositories/users-repository";
import { HashComparer } from "../repositories/hash-comparer";
import { Encrypter } from "../repositories/encrypter";
import { Injectable } from "@nestjs/common";

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string;
  }
>;

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
  }
}


@Injectable()               
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}

