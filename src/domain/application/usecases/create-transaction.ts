import { Either, left, right } from "@/core/either"
import { Transaction } from "@/domain/enterprise/entities/transaction"
import { TransactionsRepository } from "../repositories/transactions-repository"
import { CategoriesRecipeRepository } from "../repositories/categories-recipe-repository" 
import { AccountsRepository } from "../repositories/accounts-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Injectable } from "@nestjs/common"


@Injectable()
export class CreateTransactionUseCase {
    constructor(
        private transactionRepository: TransactionsRepository,
        private categoryRepository: CategoriesRecipeRepository,
        private accountRepository: AccountsRepository
        ) {}

    async execute(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
        const { amount, type, description, date, accountId, categoryId } = request
        const category = await this.categoryRepository.findById(categoryId)
        const account = await this.accountRepository.findById(accountId)
        
        if (!category) {
            return left({ message: 'Category not found' })
        }

        if (!account) {
            return left({ message: 'Account not found' })
        }

        const transaction = Transaction.create({ amount, type, description, date, accountId: new UniqueEntityID(accountId), categoryId: new UniqueEntityID(categoryId) })
       
        if (type === 'income') {
            account.updateBalance(account.balance + amount)
        } else {
            account.updateBalance(account.balance - amount)
        }

        await this.transactionRepository.create(transaction)
        await this.accountRepository.update(account)
        

        return right({ transaction })
    }
}

interface CreateTransactionRequest {
    amount: number
    type: 'income' | 'expense'
    description: string
    date: Date
    accountId: string
    categoryId: string
}

type CreateTransactionResponse = Either<
    { message: string },
    { transaction: Transaction }
>       