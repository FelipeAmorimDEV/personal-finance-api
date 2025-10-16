import { Account } from "@/domain/enterprise/entities/account"
import { AccountsRepository} from "@/domain/application/repositories/accounts-repository"
import { Either, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Injectable } from "@nestjs/common"


@Injectable()
export class CreateAccountUseCase {
    constructor(private accountRepository: AccountsRepository) {}

    async execute(request: CreateAccountRequest): Promise<CreateAccountResponse> {
        const { name, balance, userId, color, icon } = request

        const account = Account.create({ 
            name, 
            balance, 
            userId: new UniqueEntityID(userId),
            color,
            icon
        })

        await this.accountRepository.create(account)

        return right({ account })   
    }
}

type CreateAccountResponse = Either<
    { message: string },
    { account: Account }
>

interface CreateAccountRequest {
    name: string
    balance: number
    userId: string
    color?: string
    icon?: string
}