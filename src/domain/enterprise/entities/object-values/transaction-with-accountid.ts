import { ValueObject } from "@/core/entities/value-object";
import { Transaction } from "../transaction";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class TransactionWithAccountId extends ValueObject<{
    amount: number
    type: 'income' | 'expense'
    description: string
    date: Date
    accountName: string
    accountId: UniqueEntityID
    categoryId: UniqueEntityID
    createdAt: Date
    updatedAt: Date
}> {
    get amount() {
        return this.props.amount
    }

    get type() {
        return this.props.type
    }

    get description() {
        return this.props.description
    }

    get date() {
        return this.props.date
    }
    
    get accountName() {
        return this.props.accountName
    }

    get accountId() {
        return this.props.accountId
    }

    get categoryId() {
        return this.props.categoryId
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    static create(props: {
        amount: number
        type: 'income' | 'expense'
        description: string
        date: Date
        accountId: UniqueEntityID
        categoryId: UniqueEntityID
        createdAt: Date
        updatedAt: Date
        accountName: string
    }) {
        const transaction = new TransactionWithAccountId(props)
        return transaction
    }
}