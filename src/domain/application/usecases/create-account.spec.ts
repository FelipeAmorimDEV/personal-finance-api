import { InMemoryCategoriesRecipeRepository } from "../../../../test/repositories/in-memory-categories-recipe-repository"
import { CreateAccountUseCase } from "./create-account"
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository"

let inMemoryAccountsRepository: InMemoryAccountsRepository
let sut: CreateAccountUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    sut = new CreateAccountUseCase(inMemoryAccountsRepository)
  })

  it('should be able to create a category', async () => {
    const result = await sut.execute({
      name: 'Account 1',
      balance: 100,
      userId: '1'
    })

    if (result.isRight()) {

    expect(result.isRight()).toBe(true)
    expect(result.value?.account.name).toBe('Account 1')
    }
  })
})
