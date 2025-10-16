import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { CategoriesRecipeRepository } from "../repositories/categories-recipe-repository"

interface DeleteCategoryRecipeUseCaseRequest {
  id: string
}

type DeleteCategoryRecipeUseCaseResponse = Either<
  ResourceNotFoundError,
  {}
>

export class DeleteCategoryRecipeUseCase {
  constructor(private categoryRepository: CategoriesRecipeRepository) {}

  async execute(request: DeleteCategoryRecipeUseCaseRequest): Promise<DeleteCategoryRecipeUseCaseResponse> {
    const { id } = request

    const category = await this.categoryRepository.findById(id)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    await this.categoryRepository.delete(id)

    return right({})
  }
}
