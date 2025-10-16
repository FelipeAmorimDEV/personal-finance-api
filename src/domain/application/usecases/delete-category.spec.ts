import { InMemoryCategoriesRecipeRepository } from "../../../../test/repositories/in-memory-categories-recipe-repository"
import { DeleteCategoryRecipeUseCase } from "./delete-category"
import { CreateCategoryRecipeUseCase } from "./create-category"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"

let inMemoryCategoriesRecipeRepository: InMemoryCategoriesRecipeRepository
let sut: DeleteCategoryRecipeUseCase


describe('Delete Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRecipeRepository = new InMemoryCategoriesRecipeRepository()
    sut = new DeleteCategoryRecipeUseCase(inMemoryCategoriesRecipeRepository)
  })

  it('should be able to delete a category', async () => {
        await inMemoryCategoriesRecipeRepository.create(CategoryRecipe.create({ name: 'Category 1' }, new UniqueEntityID('1'))  )

    const result = await sut.execute({
      id: '1'
    })

    if (result.isRight()) {

    expect(result.isRight()).toBe(true)
    
    const categories = await inMemoryCategoriesRecipeRepository.findAll()
    expect(categories).toHaveLength(0)
  }})

  it('should not be able to delete a non-existent category', async () => {
    const result = await sut.execute({
      id: 'non-existent-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
  })
})
