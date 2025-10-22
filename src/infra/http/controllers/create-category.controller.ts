import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, Logger } from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CreateCategoryRecipeUseCase } from "@/domain/application/usecases/create-category";
import { z } from "zod";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";


const createCategoryBodySchema = z.object({
    name: z.string(),
    description: z.string().optional().default(""),
    color: z.string().optional().default("#fff"),
    icon: z.string().optional().default("0")
})

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@Controller('categories')
export class CreateCategoryController {
    private readonly logger = new Logger(CreateCategoryController.name);

    constructor(private createCategoryRecipeUseCase: CreateCategoryRecipeUseCase){}

    @Post()
    @HttpCode(201)
    async handle(@Body(new ZodValidationPipe(createCategoryBodySchema)) body: CreateCategoryBodySchema, @CurrentUser() user: UserPayload) {
        this.logger.debug(`Received body: ${JSON.stringify(body)}`);
        this.logger.debug(`User: ${user.sub}`);

        const { name, description, color, icon } = body
        const userId = user.sub

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