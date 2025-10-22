import { CreateTransactionUseCase } from "@/domain/application/usecases/create-transaction"
import { BadRequestException, Controller, Post } from "@nestjs/common"
import { Body } from "@nestjs/common"
import { HttpCode } from "@nestjs/common"
import { UsePipes } from "@nestjs/common"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { z } from "zod"

const createTransactionBodySchema = z.object({
    amount: z.number(),
    type: z.enum(['income', 'expense']),
    description: z.string(),
    date: z.string(),
    accountId: z.string(),
    categoryId: z.string()
})

type CreateTransactionBodySchema = z.infer<typeof createTransactionBodySchema>

@Controller('/transactions')
export class CreateTransactionController {
    constructor(private createTransactionUseCase: CreateTransactionUseCase) { }

    @Post()
    @HttpCode(201)
    async handle(@Body(new ZodValidationPipe(createTransactionBodySchema)) body: CreateTransactionBodySchema) {

        const { amount, type, description, date, accountId, categoryId } = body

        const result = await this.createTransactionUseCase.execute({ amount, type, description, date: new Date(date), accountId, categoryId })
        
        if (result.isLeft()) {
            throw new BadRequestException(result.value.message)
        }

        return {
            transaction: {
                id: result.value.transaction.id.toString(),
                amount: result.value.transaction.amount,
                type: result.value.transaction.type,
                description: result.value.transaction.description,
                date: result.value.transaction.date,
                accountId: result.value.transaction.accountId.toString(),
                categoryId: result.value.transaction.categoryId.toString(),
                createdAt: result.value.transaction.createdAt,
                updatedAt: result.value.transaction.updatedAt,
            }
        }
    }
}

