import { Controller, Get, Query } from "@nestjs/common";
import { ListTransactionsUseCase } from "@/domain/application/usecases/list-transactions";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/transactions")
export class ListTransactionsController {
  constructor(private listTransactions: ListTransactionsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query("month") month?: string,
    @Query("year") year?: string,
    @Query("type") type?: "income" | "expense",
    @Query("categoryId") categoryId?: string,
    @Query("accountId") accountId?: string
  ) {
    const result = await this.listTransactions.execute({
      userId: user.sub,
      month: month ? parseInt(month) : undefined,
      year: year ? parseInt(year) : undefined,
      type,
      categoryId,
      accountId,
    });

    if (result.isRight()) {
      const { transactions, total } = result.value;

      return {
        transactions: transactions.map((transaction) => ({
          id: transaction.id.toString(),
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          date: transaction.date,
          accountId: transaction.accountId.toString(),
          categoryId: transaction.categoryId.toString(),
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        })),
        total,
      };
    }
  }
}

