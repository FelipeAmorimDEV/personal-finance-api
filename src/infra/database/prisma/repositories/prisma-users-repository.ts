import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { User } from "@/domain/enterprise/entities/user";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map(PrismaUserMapper.toDomain);
  }

  async update(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}

