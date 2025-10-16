import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository"
import { InMemoryTransactionsRepository } from "test/repositories/in-memory-transactions-repository"
import { InMemoryCategoriesRecipeRepository } from "test/repositories/in-memory-categories-recipe-repository"
import { GetDashboardInfoUseCase } from "./get-dashboard-info"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Account } from "@/domain/enterprise/entities/account"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"
import { CreateTransactionUseCase } from "./create-transaction"

let sut: GetDashboardInfoUseCase
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryAccountsRepository: InMemoryAccountsRepository
let inMemoryCategoriesRecipeRepository: InMemoryCategoriesRecipeRepository
let createTransactionUseCase: CreateTransactionUseCase
    
describe('Get Dashboard Info', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    inMemoryCategoriesRecipeRepository = new InMemoryCategoriesRecipeRepository(inMemoryTransactionsRepository)
    createTransactionUseCase = new CreateTransactionUseCase(inMemoryTransactionsRepository, inMemoryCategoriesRecipeRepository, inMemoryAccountsRepository)
    sut = new GetDashboardInfoUseCase(inMemoryTransactionsRepository, inMemoryAccountsRepository, inMemoryCategoriesRecipeRepository)
  })

  it('should be able to get dashboard info', async () => {
    const getDashboardInfoUseCase = new GetDashboardInfoUseCase(inMemoryTransactionsRepository, inMemoryAccountsRepository, inMemoryCategoriesRecipeRepository)
    const result = await getDashboardInfoUseCase.execute({ userId: '1' })
    expect(result.isRight).toBeTruthy()
    expect(result.value).toBeDefined()
    expect(result.value?.accounts).toBeDefined()
    expect(result.value?.transactionsByAccount).toBeDefined()
    expect(result.value?.transactionsByCategory).toBeDefined()
    expect(result.value?.accounts.length).toBe(0)
    expect(result.value?.transactionsByAccount.length).toBe(0)
    expect(result.value?.transactionsByCategory.length).toBe(0)
  })

  it("should be able to get dashboard info with transactions", async () => {

    const account = Account.create({
      name: 'Account 1',
      balance: 100,
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryAccountsRepository.create(account)

    const category = CategoryRecipe.create({
        name: 'Category 1',
        description: 'Category 1 description',
        userId: new UniqueEntityID('user-1')
    })
    await inMemoryCategoriesRecipeRepository.create(category)
    
    await createTransactionUseCase.execute({
        amount: 100,
        type: 'income',
        description: 'Transaction 1 description',
        date: new Date(),
        accountId: account.id.toString(),
        categoryId: category.id.toString()
    })
   
    

    const getDashboardInfoUseCase = new GetDashboardInfoUseCase(inMemoryTransactionsRepository, inMemoryAccountsRepository, inMemoryCategoriesRecipeRepository)
    const result = await getDashboardInfoUseCase.execute({ userId: 'user-1' })
    expect(result.isRight).toBeTruthy()
    expect(result.value).toBeDefined()
    expect(result.value?.accounts.length).toBe(1)
    expect(result.value?.transactionsByAccount.length).toBe(1)
    expect(result.value?.transactionsByCategory.length).toBe(1)
    expect(result.value?.accounts[0].name).toBe('Account 1')
    expect(result.value?.transactionsByAccount[0].amount).toBe(100)
    expect(result.value?.transactionsByCategory[0].amount).toBe(100)
  
 
  })
})
