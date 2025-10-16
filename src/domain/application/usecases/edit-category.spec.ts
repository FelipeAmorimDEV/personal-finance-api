import { InMemoryCategoriesRecipeRepository } from "../../../../test/repositories/in-memory-categories-recipe-repository"
import { EditCategoryRecipeUseCase } from "./edit-category"
import { CreateCategoryRecipeUseCase } from "./create-category"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryCategoriesRecipeRepository: InMemoryCategoriesRecipeRepository
let sut: EditCategoryRecipeUseCase
let createCategoryUseCase: CreateCategoryRecipeUseCase

describe('Edit Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRecipeRepository = new InMemoryCategoriesRecipeRepository()
    sut = new EditCategoryRecipeUseCase(inMemoryCategoriesRecipeRepository)
  })

  it('should be able to edit a category', async () => {
  await inMemoryCategoriesRecipeRepository.create(CategoryRecipe.create({ name: 'Category 1' }, new UniqueEntityID('1'))  )
  

    const result = await sut.execute({
      id: '1',
      name: 'Category 1 Updated'
    })

    if (result.isRight()) {

      expect(result.isRight()).toBe(true)
      expect(result.value?.category.name).toBe('Category 1 Updated')
    }
  })

  it('should not be able to edit a non-existent category', async () => {
    const result = await sut.execute({
      id: 'non-existent-id',
      name: 'Category 1 Updated'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
  })
})
