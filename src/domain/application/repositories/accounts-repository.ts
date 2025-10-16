import { Account } from "@/domain/enterprise/entities/account"

export abstract class AccountsRepository {
    abstract create(account: Account): Promise<void>
    abstract findById(id: string): Promise<Account | null>
    abstract findAll(): Promise<Account[]>
    abstract fetchByUserId(userId: string): Promise<Account[]>
    abstract update(account: Account): Promise<void>
    abstract delete(id: string): Promise<void>
}