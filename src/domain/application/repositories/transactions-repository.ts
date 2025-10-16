import { Transaction } from "@/domain/enterprise/entities/transaction"

export abstract class TransactionsRepository {
    abstract create(transaction: Transaction): Promise<void>
    abstract findById(id: string): Promise<Transaction | null>
    abstract findAll(): Promise<Transaction[]>
    abstract findByAccountId(accountId: string): Promise<Transaction[]>
    abstract findByCategoryId(categoryId: string): Promise<Transaction[]>
    abstract update(transaction: Transaction): Promise<void>
    abstract delete(id: string): Promise<void>
}