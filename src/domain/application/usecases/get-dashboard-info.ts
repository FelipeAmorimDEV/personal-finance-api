
import { AccountsRepository } from "../repositories/accounts-repository"
import { TransactionsRepository } from "../repositories/transactions-repository"
import { CategoriesRecipeRepository } from "../repositories/categories-recipe-repository"
import { Either, right } from "@/core/either"
import { Account } from "@/domain/enterprise/entities/account"
import { TransactionWithAccountId } from "@/domain/enterprise/entities/object-values/transaction-with-accountid"
import { TransactionWithCategoryName } from "@/domain/enterprise/entities/object-values/transaction-with-categoryname"
import { Injectable } from "@nestjs/common"

@Injectable()   
export class GetDashboardInfoUseCase {
    constructor(private transactionRepository: TransactionsRepository, private accountRepository: AccountsRepository, private categoryRepository: CategoriesRecipeRepository) {}

    async execute(request: GetDashboardInfoRequest): Promise<GetDashboardInfoResponse> {
        const { userId } = request

        const accounts = await this.accountRepository.fetchByUserId(userId)  

        const transactionsByAccount: TransactionWithAccountId[] = []
        const transactionsByCategory: TransactionWithCategoryName[] = []

        for (const account of accounts) {
            const transactionsByAccountData = await this.transactionRepository.findByAccountId(account.id.toString())
            const transasctioByAccoutDataWithAccountName = transactionsByAccountData.map(transaction => TransactionWithAccountId.create({ accountName: account.name, accountId: account.id, categoryId: transaction.categoryId, createdAt: transaction.createdAt, updatedAt: transaction.updatedAt, amount: transaction.amount, type: transaction.type, description: transaction.description, date: transaction.date }))
            transactionsByAccount.push(...transasctioByAccoutDataWithAccountName)
        }
        
        const categories = await this.categoryRepository.findAllByUserId(userId)

        for (const category of categories) {
            const transactionsByCategoryData = await this.transactionRepository.findByCategoryId(category.id.toString())
            const transasctioByCategoryDataWithCategoryName = transactionsByCategoryData.map(transaction => TransactionWithCategoryName.create({ categoryName: category.name, categoryId: category.id, accountId: transaction.accountId, createdAt: transaction.createdAt, updatedAt: transaction.updatedAt, amount: transaction.amount, type: transaction.type, description: transaction.description, date: transaction.date }))
            transactionsByCategory.push(...transasctioByCategoryDataWithCategoryName)
        }

        const sortedTransactionsByAccount = transactionsByAccount.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        const sortedTransactionsByCategory = transactionsByCategory.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0)
        const totalIncome = sortedTransactionsByAccount.filter(transaction => transaction.type === 'income').reduce((acc, transaction) => acc + transaction.amount, 0)
        const totalExpense = sortedTransactionsByAccount.filter(transaction => transaction.type === 'expense').reduce((acc, transaction) => acc + transaction.amount, 0)

        return right({  accounts, transactionsByAccount: [...sortedTransactionsByAccount], transactionsByCategory: [...sortedTransactionsByCategory], totalBalance, totalIncome, totalExpense })
    }
}


type GetDashboardInfoResponse = Either<
    never,
    { accounts: Account[], transactionsByAccount: TransactionWithAccountId[], transactionsByCategory: TransactionWithCategoryName[], totalBalance: number, totalIncome: number, totalExpense: number }
>
interface GetDashboardInfoRequest {
    userId: string
}   