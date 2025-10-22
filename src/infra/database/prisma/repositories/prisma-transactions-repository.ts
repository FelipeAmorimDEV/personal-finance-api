import { Injectable } from "@nestjs/common"
import { TransactionsRepository, FindManyTransactionsParams } from "@/domain/application/repositories/transactions-repository"
import { Transaction } from "@/domain/enterprise/entities/transaction"
import { PrismaService } from "../prisma.service"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

@Injectable()
export class PrismaTransactionsRepository implements TransactionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.create({
      data: {
        id: transaction.id.toString(),
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        date: transaction.date,
        accountId: transaction.accountId.toString(),
        categoryId: transaction.categoryId.toString(),
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    })
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    })

    if (!transaction) {
      return null
    }

    return Transaction.create(
      {
        amount: transaction.amount,
        type: transaction.type as 'income' | 'expense',
        description: transaction.description,
        date: transaction.date,
        accountId: new UniqueEntityID(transaction.accountId),
        categoryId: new UniqueEntityID(transaction.categoryId),
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
      new UniqueEntityID(transaction.id)
    )
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return transactions.map((transaction) =>
      Transaction.create(
        {
          amount: transaction.amount,
          type: transaction.type as 'income' | 'expense',
          description: transaction.description,
          date: transaction.date,
          accountId: new UniqueEntityID(transaction.accountId),
          categoryId: new UniqueEntityID(transaction.categoryId),
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        },
        new UniqueEntityID(transaction.id)
      )
    )
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    })

    return transactions.map((transaction) =>
      Transaction.create(
        {
          amount: transaction.amount,
          type: transaction.type as 'income' | 'expense',
          description: transaction.description,
          date: transaction.date,
          accountId: new UniqueEntityID(transaction.accountId),
          categoryId: new UniqueEntityID(transaction.categoryId),
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        },
        new UniqueEntityID(transaction.id)
      )
    )
  }

  async findByCategoryId(categoryId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { categoryId },
      orderBy: { createdAt: 'desc' },
    })

    return transactions.map((transaction) =>
      Transaction.create(
        {
          amount: transaction.amount,
          type: transaction.type as 'income' | 'expense',
          description: transaction.description,
          date: transaction.date,
          accountId: new UniqueEntityID(transaction.accountId),
          categoryId: new UniqueEntityID(transaction.categoryId),
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        },
        new UniqueEntityID(transaction.id)
      )
    )
  }

  async update(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.update({
      where: { id: transaction.id.toString() },
      data: {
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        date: transaction.date,
        accountId: transaction.accountId.toString(),
        categoryId: transaction.categoryId.toString(),
        updatedAt: transaction.updatedAt,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    })
  }

  async findManyWithFilters(params: FindManyTransactionsParams): Promise<Transaction[]> {
    const { userId, month, year, type, categoryId, accountId } = params;

    // Construir filtro de data
    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      dateFilter = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      dateFilter = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        account: {
          userId,
        },
        ...dateFilter,
        ...(type && { type }),
        ...(categoryId && { categoryId }),
        ...(accountId && { accountId }),
      },
      orderBy: { date: 'desc' },
    });

    return transactions.map((transaction) =>
      Transaction.create(
        {
          amount: transaction.amount,
          type: transaction.type as 'income' | 'expense',
          description: transaction.description,
          date: transaction.date,
          accountId: new UniqueEntityID(transaction.accountId),
          categoryId: new UniqueEntityID(transaction.categoryId),
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        },
        new UniqueEntityID(transaction.id)
      )
    );
  }
}

