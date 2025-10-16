import { ValueObject } from "@/core/entities/value-object";
import { Transaction } from "../transaction";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class TransactionWithCategoryName extends ValueObject<{
    amount: number
    type: 'income' | 'expense'
    description: string
    date: Date
    categoryName: string
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
    
    get categoryName() {
        return this.props.categoryName
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
        categoryName: string
    }) {
        return new TransactionWithCategoryName(props)
    }
}