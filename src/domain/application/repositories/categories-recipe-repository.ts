import { CategoryRecipe} from "@/domain/enterprise/entities/category"

export abstract class CategoriesRecipeRepository {
  abstract create(category: CategoryRecipe): Promise<void>
  abstract findById(id: string): Promise<CategoryRecipe | null>
  abstract findAll(): Promise<CategoryRecipe[]>
  abstract findAllByUserId(userId: string): Promise<CategoryRecipe[]>
  abstract update(category: CategoryRecipe): Promise<void>
  abstract delete(id: string): Promise<void>
}