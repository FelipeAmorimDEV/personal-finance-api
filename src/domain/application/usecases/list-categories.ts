import { Either, right } from "@/core/either"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"
import { CategoriesRecipeRepository } from "../repositories/categories-recipe-repository"
import { Injectable } from "@nestjs/common"

type ListCategoriesRecipeUseCaseResponse = Either<
  never,
  { categories: CategoryRecipe[] }
>

@Injectable()
export class ListCategoriesRecipeUseCase {
  constructor(private categoryRepository: CategoriesRecipeRepository) {}

  async execute(): Promise<ListCategoriesRecipeUseCaseResponse> {
    const categories = await this.categoryRepository.findAll()

    return right({ categories })
  }
}
