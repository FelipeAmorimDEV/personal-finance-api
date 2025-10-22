import { CreateAccountUseCase } from "@/domain/application/usecases/create-account";
import { CreateTransactionUseCase } from "@/domain/application/usecases/create-transaction";
import { BadRequestException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";


const createAccountBodySchema = z.object({
    name: z.string(),
    balance: z.number(),
    color: z.string().optional().default("#fff"),
    icon: z.string().optional().default("0")
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/transaction-account')
export class CreateTransactionAccountController {
    constructor(private createAccountUseCase: CreateAccountUseCase) {}

    @Post()
    @HttpCode(201)
    async handle(@Body(new ZodValidationPipe(createAccountBodySchema)) body: CreateAccountBodySchema, @CurrentUser() user: UserPayload) {
        const { name, balance, color, icon } = body
        const userId = user.sub

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

