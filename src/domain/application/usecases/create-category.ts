import { Either, right } from "@/core/either"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"
import { CategoriesRecipeRepository } from "../repositories/categories-recipe-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Injectable } from "@nestjs/common"

interface CreateCategoryRecipeUseCaseRequest {
  name: string
  userId: string
  description: string
  color?: string
  icon?: string
}

type CreateCategoryRecipeUseCaseResponse = Either<
  { message: string },
  { category: CategoryRecipe }
>


@Injectable()
export class CreateCategoryRecipeUseCase {	
  constructor(private categoryRepository: CategoriesRecipeRepository) {}

  async execute(request: CreateCategoryRecipeUseCaseRequest): Promise<CreateCategoryRecipeUseCaseResponse> {
    const { name, userId, description, color, icon } = request

    const category = CategoryRecipe.create({ 
      name, 
      userId: new UniqueEntityID(userId), 
      description,
      color,
      icon
    })


    await this.categoryRepository.create(category)

    return right({ category })
  }
}