import { CreateAccountUseCase } from "@/domain/application/usecases/create-account";
import { CreateTransactionUseCase } from "@/domain/application/usecases/create-transaction";
import { BadRequestException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";


const createAccountBodySchema = z.object({
    name: z.string(),
    balance: z.number(),
    userId: z.string().optional().default("b23a7adf-e397-4dfe-9d58-51921c65a68a"),
    color: z.string().optional().default("#fff"),
    icon: z.string().optional().default("0")
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/transaction-account')
export class CreateTransactionAccountController {
    constructor(private createAccountUseCase: CreateAccountUseCase) {}

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body: CreateAccountBodySchema) {
        const { name, balance, userId, color, icon } = body

        const result = await this.createAccountUseCase.execute({ name, balance, userId, color, icon })

        if (result.isLeft()) {
            throw new BadRequestException(result.value.message)
        }

        return {
            account: {
                id: result.value.account.id.toString(),
                name: result.value.account.name,
                balance: result.value.account.balance,
                userId: result.value.account.userId.toString(),
                color: result.value.account.color,
                icon: result.value.account.icon,
                createdAt: result.value.account.createdAt,
                updatedAt: result.value.account.updatedAt,
                }
        }
    }
}

