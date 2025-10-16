import { GetDashboardInfoUseCase } from "@/domain/application/usecases/get-dashboard-info"
import { BadRequestException, Controller, Get, Query } from "@nestjs/common"
import { UsePipes } from "@nestjs/common"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { z } from "zod"

const getDashboardInfoQuerySchema = z.object({
    userId: z.string()
})

type GetDashboardInfoQuerySchema = z.infer<typeof getDashboardInfoQuerySchema>

@Controller('/dashboard')
export class GetDashboardInfoController {
    constructor(private getDashboardInfoUseCase: GetDashboardInfoUseCase) { }

    @Get()
    @UsePipes(new ZodValidationPipe(getDashboardInfoQuerySchema))
    async handle(@Query() query: GetDashboardInfoQuerySchema) {
        const { userId } = query

        const result = await this.getDashboardInfoUseCase.execute({ userId })
        
        if (result.isLeft()) {
            throw new BadRequestException('Failed to get dashboard info')
        }

        return {
            accounts: result.value.accounts.map(account => ({
                id: account.id.toString(),
                name: account.name,
                balance: account.balance,
                userId: account.userId.toString(),
                color: account.color,
                icon: account.icon,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
            })),
            transactionsByAccount: result.value.transactionsByAccount.map(transaction => ({
                amount: transaction.amount,
                type: transaction.type,
                description: transaction.description,
                date: transaction.date,
                accountId: transaction.accountId.toString(),
                accountName: transaction.accountName,
                categoryId: transaction.categoryId.toString(),
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            })),
            transactionsByCategory: result.value.transactionsByCategory.map(transaction => ({
                amount: transaction.amount,
                type: transaction.type,
                description: transaction.description,
                date: transaction.date,
                accountId: transaction.accountId.toString(),
                categoryId: transaction.categoryId.toString(),
                categoryName: transaction.categoryName,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            })),
            totalBalance: result.value.totalBalance,
            totalIncome: result.value.totalIncome,
            totalExpense: result.value.totalExpense
        }
    }
}
