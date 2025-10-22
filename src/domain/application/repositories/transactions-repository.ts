import { Transaction } from "@/domain/enterprise/entities/transaction"

export interface FindManyTransactionsParams {
    userId: string
    month?: number
    year?: number
    type?: 'income' | 'expense'
    categoryId?: string
    accountId?: string
}

export abstract class TransactionsRepository {
    abstract create(transaction: Transaction): Promise<void>
    abstract findById(id: string): Promise<Transaction | null>
    abstract findAll(): Promise<Transaction[]>
    abstract findByAccountId(accountId: string): Promise<Transaction[]>
    abstract findByCategoryId(categoryId: string): Promise<Transaction[]>
    abstract findManyWithFilters(params: FindManyTransactionsParams): Promise<Transaction[]>
    abstract update(transaction: Transaction): Promise<void>
    abstract delete(id: string): Promise<void>
}