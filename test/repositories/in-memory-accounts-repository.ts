import { AccountsRepository } from "@/domain/application/repositories/accounts-repository"
import { Account } from "@/domain/enterprise/entities/account"

export class InMemoryAccountsRepository implements AccountsRepository {
    fetchByUserId(userId: string): Promise<Account[]> {
        return Promise.resolve(this.items.filter(item => item.userId.toString() === userId))
    }
    public items: Account[] = []

    findById(id: string): Promise<Account | null> {
        return Promise.resolve(this.items.find(item => item.id.toString() === id) ?? null)
    }
 
    findAll(): Promise<Account[]> {
        return Promise.resolve(this.items)
    }
    update(account: Account): Promise<void> {
            const itemIndex = this.items.findIndex(item => item.id.toString() === account.id.toString())
        this.items[itemIndex] = account
        return Promise.resolve()
    }
    delete(id: string): Promise<void> {
        const itemIndex = this.items.findIndex(item => item.id.toString() === id)
        this.items.splice(itemIndex, 1)
        return Promise.resolve()
    }


    async create(account: Account): Promise<void> {
        this.items.push(account)
    }
}