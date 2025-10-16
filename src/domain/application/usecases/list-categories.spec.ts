import { InMemoryCategoriesRecipeRepository } from "../../../../test/repositories/in-memory-categories-recipe-repository"
import { ListCategoriesRecipeUseCase } from "./list-categories"
import { CreateCategoryRecipeUseCase } from "./create-category"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"
import { InMemoryTransactionsRepository } from "test/repositories/in-memory-transactions-repository"

let inMemoryCategoriesRecipeRepository: InMemoryCategoriesRecipeRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: ListCategoriesRecipeUseCase


describe('List Categories', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryCategoriesRecipeRepository = new InMemoryCategoriesRecipeRepository(inMemoryTransactionsRepository)
    sut = new ListCategoriesRecipeUseCase(inMemoryCategoriesRecipeRepository)

  })

  it('should be able to list all categories', async () => {
    await inMemoryCategoriesRecipeRepository.create(CategoryRecipe.create({ name: 'Category 1', userId: new UniqueEntityID('1'), description: 'Category 1 description' }, new UniqueEntityID('1'))  )


    await inMemoryCategoriesRecipeRepository.create(CategoryRecipe.create({ name: 'Category 2', userId: new UniqueEntityID('2'), description: 'Category 2 description' }, new UniqueEntityID('2 '))  )


    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value?.categories).toHaveLength(2)
    expect(result.value?.categories[0].name).toBe('Category 1')
    expect(result.value?.categories[1].name).toBe('Category 2')
  })

  it('should be able to list empty categories', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value?.categories).toHaveLength(0)
  })
})
