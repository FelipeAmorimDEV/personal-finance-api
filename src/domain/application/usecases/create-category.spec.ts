import { InMemoryCategoriesRecipeRepository } from "../../../../test/repositories/in-memory-categories-recipe-repository"
import { CreateCategoryRecipeUseCase } from "./create-category"
import { InMemoryTransactionsRepository } from "../../../../test/repositories/in-memory-transactions-repository"

let inMemoryCategoriesRecipeRepository: InMemoryCategoriesRecipeRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: CreateCategoryRecipeUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryCategoriesRecipeRepository = new InMemoryCategoriesRecipeRepository(inMemoryTransactionsRepository)
    sut = new CreateCategoryRecipeUseCase(inMemoryCategoriesRecipeRepository)
    
  })

  it('should be able to create a category', async () => {
    const result = await sut.execute({
      name: 'Category 1'
    })

    if (result.isRight()) {

    expect(result.isRight()).toBe(true)
    expect(result.value?.category.name).toBe('Category 1')
    }
  })
})
