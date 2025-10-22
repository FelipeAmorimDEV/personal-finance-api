import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { UsersRepository } from "@/domain/application/repositories/users-repository";

@Controller("/me")
export class GetProfileController {
  constructor(private usersRepository: UsersRepository) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userProfile = await this.usersRepository.findById(user.sub);

    if (!userProfile) {
      return null;
    }

    return {
      user: {
        id: userProfile.id.toString(),
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
        avatar: userProfile.avatar,
        createdAt: userProfile.createdAt,
      },
    };
  }
}

