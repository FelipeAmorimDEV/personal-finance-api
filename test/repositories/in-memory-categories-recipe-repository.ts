import { CategoriesRecipeRepository } from "@/domain/application/repositories/categories-recipe-repository"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"
import { Transaction } from "@/domain/enterprise/entities/transaction"
import { InMemoryTransactionsRepository } from "./in-memory-transactions-repository"

export class InMemoryCategoriesRecipeRepository implements CategoriesRecipeRepository {
   constructor(private inMemoryTransactionsRepository: InMemoryTransactionsRepository){}
    
    public items: CategoryRecipe[] =[]

    async findAllByUserId(userId: string): Promise<CategoryRecipe[]> {
        const categories = this.items.filter(item => item.userId.toString() === userId)
        return Promise.resolve(categories)
    }

    async findAllTransactionsByCategoriesbyUserId(userId: string): Promise<Transaction[]> {
        const categories = this.items.filter(item => item.userId.toString() === userId)
        const transactions: Transaction[] = []
        for (const category of categories) {
            const transactionsByCategory = await this.inMemoryTransactionsRepository.findByCategoryId(category.id.toString())
            transactions.push(...transactionsByCategory)
        }
        return transactions
        }

    findById(id: string): Promise<CategoryRecipe | null> {
        return Promise.resolve(this.items.find(item => item.id.toString() === id) ?? null)
    }
    findAll(): Promise<CategoryRecipe[]> {
        return Promise.resolve(this.items)
    }
    update(category: CategoryRecipe): Promise<void> {
        const itemIndex = this.items.findIndex(item => item.id.toString() === category.id.toString())
        this.items[itemIndex] = category
        return Promise.resolve()
    }
    delete(id: string): Promise<void> {
        const itemIndex = this.items.findIndex(item => item.id.toString() === id)
        this.items.splice(itemIndex, 1)
        return Promise.resolve()
    }


    async create(category: CategoryRecipe): Promise<void> {
        this.items.push(category)
    }
}