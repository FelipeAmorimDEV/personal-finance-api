import { Either, right } from "@/core/either";
import { Transaction } from "@/domain/enterprise/entities/transaction";
import { TransactionsRepository, FindManyTransactionsParams } from "../repositories/transactions-repository";
import { Injectable } from "@nestjs/common";

interface ListTransactionsUseCaseRequest {
  userId: string;
  month?: number;
  year?: number;
  type?: 'income' | 'expense';
  categoryId?: string;
  accountId?: string;
}

type ListTransactionsUseCaseResponse = Either<
  null,
  {
    transactions: Transaction[];
    total: number;
  }
>;


@Injectable()           
export class ListTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(
    request: ListTransactionsUseCaseRequest
  ): Promise<ListTransactionsUseCaseResponse> {
    const params: FindManyTransactionsParams = {
      userId: request.userId,
      month: request.month,
      year: request.year,
      type: request.type,
      categoryId: request.categoryId,
      accountId: request.accountId,
    };

    const transactions = await this.transactionsRepository.findManyWithFilters(params);

    return right({
      transactions,
      total: transactions.length,
    });
  }
}

