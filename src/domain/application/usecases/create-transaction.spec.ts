import { InMemoryTransactionsRepository } from "../../../../test/repositories/in-memory-transactions-repository"
import { InMemoryCategoriesRecipeRepository } from "../../../../test/repositories/in-memory-categories-recipe-repository"
import { InMemoryAccountsRepository } from "../../../../test/repositories/in-memory-accounts-repository"
import { CreateTransactionUseCase } from "./create-transaction"
import { Account } from "@/domain/enterprise/entities/account"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRecipeRepository
let inMemoryAccountsRepository: InMemoryAccountsRepository
let sut: CreateTransactionUseCase

describe('Create Transaction', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRecipeRepository(inMemoryTransactionsRepository)
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    sut = new CreateTransactionUseCase(
      inMemoryTransactionsRepository,
      inMemoryCategoriesRepository,
      inMemoryAccountsRepository
    )
  })

  it('should be able to create a transaction', async () => {
    // Create a category first
    const category = CategoryRecipe.create({
      name: 'Food',
      description: 'Food expenses',
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryCategoriesRepository.create(category)

    // Create an account first
    const account = Account.create({
      name: 'Checking Account',
      balance: 1000,
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryAccountsRepository.create(account)

    const result = await sut.execute({
      amount: 50.00,
      type: 'expense',
      description: 'Lunch at restaurant',
      date: new Date('2024-01-15'),
      accountId: account.id.toString(),
      categoryId: category.id.toString()
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.transaction.amount).toBe(50.00)
      expect(result.value.transaction.type).toBe('expense')
      expect(result.value.transaction.description).toBe('Lunch at restaurant')
      expect(result.value.transaction.accountId.toString()).toBe(account.id.toString())
      expect(result.value.transaction.categoryId.toString()).toBe(category.id.toString())
    }
  })

  it('should not be able to create a transaction with non-existent category', async () => {
    // Create an account first
    const account = Account.create({
      name: 'Checking Account',
      balance: 1000,
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryAccountsRepository.create(account)

    const result = await sut.execute({
      amount: 50.00,
      type: 'expense',
      description: 'Lunch at restaurant',
      date: new Date('2024-01-15'),
      accountId: account.id.toString(),
      categoryId: 'non-existent-category-id'
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value.message).toBe('Category not found')
    }
  })

  it('should not be able to create a transaction with non-existent account', async () => {
    // Create a category first
    const category = CategoryRecipe.create({
      name: 'Food',
      description: 'Food expenses',
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      amount: 50.00,
      type: 'expense',
      description: 'Lunch at restaurant',
      date: new Date('2024-01-15'),
      accountId: 'non-existent-account-id',
      categoryId: category.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value.message).toBe('Account not found')
    }
  })

  it('should be able to create an income transaction', async () => {
    // Create a category first
    const category = CategoryRecipe.create({
      name: 'Salary',
      description: 'Monthly salary',
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryCategoriesRepository.create(category)

    // Create an account first
    const account = Account.create({
      name: 'Checking Account',
      balance: 1000,
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryAccountsRepository.create(account)

    const result = await sut.execute({
      amount: 3000.00,
      type: 'income',
      description: 'Monthly salary',
      date: new Date('2024-01-01'),
      accountId: account.id.toString(),
      categoryId: category.id.toString()
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.transaction.amount).toBe(3000.00)
      expect(result.value.transaction.type).toBe('income')
      expect(result.value.transaction.description).toBe('Monthly salary')
    }
  })

  it('should persist the transaction in the repository', async () => {
    // Create a category first
    const category = CategoryRecipe.create({
      name: 'Food',
      description: 'Food expenses',
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryCategoriesRepository.create(category)

    // Create an account first
    const account = Account.create({
      name: 'Checking Account',
      balance: 1000,
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryAccountsRepository.create(account)

    const result = await sut.execute({
      amount: 25.50,
      type: 'expense',
      description: 'Coffee',
      date: new Date('2024-01-15'),
      accountId: account.id.toString(),
      categoryId: category.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTransactionsRepository.items).toHaveLength(1)
    expect(inMemoryTransactionsRepository.items[0].amount).toBe(25.50)
    expect(inMemoryTransactionsRepository.items[0].type).toBe('expense')
    expect(inMemoryTransactionsRepository.items[0].description).toBe('Coffee')
  })

  it('should update the account balance when creating an income transaction', async () => {
    const account = Account.create({
      name: 'Checking Account',
      balance: 1000,
      userId: new UniqueEntityID('user-1')
    })

    await inMemoryAccountsRepository.create(account)

    const category = CategoryRecipe.create({
      name: 'Salary',
      description: 'Monthly salary',
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryCategoriesRepository.create(category)
    
    const result = await sut.execute({
      amount: 3000.00,
      type: 'income',
      description: 'Monthly salary',
      date: new Date('2024-01-01'),
      accountId: account.id.toString(),
      categoryId: category.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAccountsRepository.items[0].balance).toBe(4000.00)
  })
  

  it('should update the account balance when creating an expense transaction', async () => {
    const account = Account.create({
      name: 'Checking Account',
      balance: 1000,
      userId: new UniqueEntityID('user-1')
    })

    await inMemoryAccountsRepository.create(account)

    const category = CategoryRecipe.create({
      name: 'Food',
      description: 'Food expenses',
      userId: new UniqueEntityID('user-1')
    })
    await inMemoryCategoriesRepository.create(category)
    
    const result = await sut.execute({
      amount: 25.50,
      type: 'expense',
      description: 'Coffee',
      date: new Date('2024-01-15'),
      accountId: account.id.toString(),
      categoryId: category.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAccountsRepository.items[0].balance).toBe(974.50)
  })

 
})
