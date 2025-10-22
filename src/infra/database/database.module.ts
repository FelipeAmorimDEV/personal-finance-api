import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service";
import { AccountsRepository } from "@/domain/application/repositories/accounts-repository";
import { CategoriesRecipeRepository } from "@/domain/application/repositories/categories-recipe-repository";
import { TransactionsRepository } from "@/domain/application/repositories/transactions-repository";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { PrismaAccountsRepository } from "./prisma/repositories/prisma-accounts-repository";
import { PrismaCategoriesRepository } from "./prisma/repositories/prisma-categories-repository";
import { PrismaTransactionsRepository } from "./prisma/repositories/prisma-transactions-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";

@Module({
    imports: [],
    providers: [
        PrismaService,
    {
        provide: AccountsRepository,
        useClass: PrismaAccountsRepository
    },
    {
        provide: CategoriesRecipeRepository,
        useClass: PrismaCategoriesRepository
    },
    {
        provide: TransactionsRepository,
        useClass: PrismaTransactionsRepository
    },
    {
        provide: UsersRepository,
        useClass: PrismaUsersRepository
    }
    ],
    exports: [PrismaService, AccountsRepository, CategoriesRecipeRepository, TransactionsRepository, UsersRepository],
})  
export class DatabaseModule {
}