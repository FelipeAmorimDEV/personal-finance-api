import { Controller, Get, HttpCode } from "@nestjs/common";
import { ListCategoriesRecipeUseCase } from "@/domain/application/usecases/list-categories";

@Controller('categories')
export class ListCategoriesController {
    constructor(private listCategoriesRecipeUseCase: ListCategoriesRecipeUseCase) {}

    @Get()
    @HttpCode(200)
    async handle() {
        const result = await this.listCategoriesRecipeUseCase.execute()

        if (result.isLeft()) {
            throw new Error('Failed to list categories')
        }

        return {
            categories: result.value.categories.map(category => ({
                id: category.id.toString(),
                name: category.name,
                description: category.description,
                userId: category.userId.toString(),
                color: category.color,
                icon: category.icon,
                createdAt: category.createdAt,
            }))
        }
    }
}
