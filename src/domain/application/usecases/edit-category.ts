import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"
import { CategoriesRecipeRepository } from "../repositories/categories-recipe-repository"

interface EditCategoryRecipeUseCaseRequest {
  id: string
  name: string
}

type EditCategoryRecipeUseCaseResponse = Either<
  ResourceNotFoundError,
  { category: CategoryRecipe }
>

export class EditCategoryRecipeUseCase {
  constructor(private categoryRepository: CategoriesRecipeRepository) {}

  async execute(request: EditCategoryRecipeUseCaseRequest): Promise<EditCategoryRecipeUseCaseResponse> {
    const { id, name } = request

    const category = await this.categoryRepository.findById(id)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    category.name = name

    await this.categoryRepository.update(category)

    return right({ category })
  }
}
