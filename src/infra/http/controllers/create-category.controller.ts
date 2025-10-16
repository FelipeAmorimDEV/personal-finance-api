import { BadRequestException, Body,  Controller,  HttpCode, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CreateCategoryRecipeUseCase } from "@/domain/application/usecases/create-category";
import { z } from "zod";


const createCategoryBodySchema = z.object({
    name: z.string(),
    userId: z.string().default("b23a7adf-e397-4dfe-9d58-51921c65a68a"),
    description: z.string().optional().default(""),
    color: z.string().optional().default("#fff"),
    icon: z.string().optional().default("0")
})

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@Controller('categories')
export class CreateCategoryController {
    constructor(private createCategoryRecipeUseCase: CreateCategoryRecipeUseCase){}

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createCategoryBodySchema))
    async handle(@Body() body: CreateCategoryBodySchema) {
        const { name, description, userId, color, icon } = body

        const result = await this.createCategoryRecipeUseCase.execute({ name, description, userId, color, icon })

        if (result.isLeft()) {
            throw new BadRequestException(result.value.message)
        }

        return {
            category: {
                id: result.value.category.id.toString(),
                name: result.value.category.name,
                description: result.value.category.description,
                userId: result.value.category.userId.toString(),
                color: result.value.category.color,
                icon: result.value.category.icon,
                createdAt: result.value.category.createdAt,
            }
        }
    }
}