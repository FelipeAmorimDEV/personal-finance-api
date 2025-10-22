import { Either, right } from "@/core/either"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"
import { CategoriesRecipeRepository } from "../repositories/categories-recipe-repository"
import { Injectable } from "@nestjs/common"

type ListCategoriesRecipeUseCaseResponse = Either<
  never,
  { categories: CategoryRecipe[] }
>

type ListCategoriesRecipeUseCaseRequest = {
  userId: string
}

@Injectable()
export class ListCategoriesRecipeUseCase {
  constructor(private categoryRepository: CategoriesRecipeRepository) {}

  async execute(request: ListCategoriesRecipeUseCaseRequest): Promise<ListCategoriesRecipeUseCaseResponse> {
    const { userId } = request
    const categories = await this.categoryRepository.findAllByUserId(userId)

    return right({ categories })
  }
}
