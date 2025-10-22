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
import { AuthModule } from "../auth/auth.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { RegisterController } from "./controllers/register.controller";
import { GetProfileController } from "./controllers/get-profile.controller";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthenticateUserUseCase } from "@/domain/application/usecases/authenticate-user";
import { RegisterUserUseCase } from "@/domain/application/usecases/register-user";
import { ListTransactionsController } from "./controllers/list-transactions.controller";
import { ListTransactionsUseCase } from "@/domain/application/usecases/list-transactions";
import { DebugTokenController } from "./controllers/debug-token.controller";
import { HealthController } from "./controllers/health.controller";

@Module({
  imports: [DatabaseModule, AuthModule, CryptographyModule],
  controllers: [
    CreateAccountController, 
    CreateCategoryController, 
    CreateTransactionAccountController,
    CreateTransactionController,
    GetDashboardInfoController,
    ListCategoriesController,
    AuthenticateController,
    RegisterController,
    GetProfileController,
    ListTransactionsController,
    DebugTokenController,
    HealthController
  ],
  providers: [
    CreateCategoryRecipeUseCase, 
    CreateAccountUseCase, 
    CreateTransactionUseCase,
    GetDashboardInfoUseCase,
    ListCategoriesRecipeUseCase,
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    ListTransactionsUseCase
  ]
})
export class HttpModule {}