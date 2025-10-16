import { Injectable } from "@nestjs/common"
import { AccountsRepository } from "@/domain/application/repositories/accounts-repository"
import { Account } from "@/domain/enterprise/entities/account"
import { PrismaService } from "../prisma.service"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
  constructor(private prisma: PrismaService) {}

  async create(account: Account): Promise<void> {
    await this.prisma.account.create({
      data: {
        id: account.id.toString(),
        name: account.name,
        balance: account.balance,
        userId: account.userId.toString(),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    })
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    })

    if (!account) {
      return null
    }

    return Account.create(
      {
        name: account.name,
        balance: account.balance,
        userId: new UniqueEntityID(account.userId),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
      new UniqueEntityID(account.id)
    )
  }

  async fetchByUserId(userId: string): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return accounts.map((account) =>
      Account.create(
        {
          name: account.name,
          balance: account.balance,
          userId: new UniqueEntityID(account.userId),
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        },
        new UniqueEntityID(account.id)
      )
    )
  }

  async findAll(): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return accounts.map((account) =>
      Account.create(
        {
          name: account.name,
          balance: account.balance,
          userId: new UniqueEntityID(account.userId),
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        },
        new UniqueEntityID(account.id)
      )
    )
  }

  async update(account: Account): Promise<void> {
    await this.prisma.account.update({
      where: { id: account.id.toString() },
      data: {
        name: account.name,
        balance: account.balance,
        userId: account.userId.toString(),
        updatedAt: account.updatedAt,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.account.delete({
      where: { id },
    })
  }
}

