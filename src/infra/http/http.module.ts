import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateCategoryController } from "./controllers/create-category.controller";
import { CreateCategoryRecipeUseCase } from "@/domain/application/usecases/create-category";
import { CreateTransactionAccountController } from "./controllers/create-transaction-account";
import { CreateAccountUseCase } from "@/domain/application/usecases/create-account";
import { CreateTransactionController } from "./controllers/create-transaction.controller";
import { CreateTransactionUseCase } from "@/domain/application/usecases/create-transaction";
import { GetDashboardInfoController } from "./controllers/get-dashboard-info.controller";
import { GetDashboardInfoUseCase } from "@/domain/application/usecases/get-dashboard-info";
import { ListCategoriesController } from "./controllers/list-categories.controller";
import { ListCategoriesRecipeUseCase } from "@/domain/application/usecases/list-categories";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController, 
    CreateCategoryController, 
    CreateTransactionAccountController,
    CreateTransactionController,
    GetDashboardInfoController,
    ListCategoriesController
  ],
  providers: [
    CreateCategoryRecipeUseCase, 
    CreateAccountUseCase, 
    CreateTransactionUseCase,
    GetDashboardInfoUseCase,
    ListCategoriesRecipeUseCase
  ]
})
export class HttpModule {}