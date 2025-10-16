import { Entity } from "@/core/entities/entities"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export class Transaction extends Entity<TransactionProps> {
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

    set amount(amount: number) {
        this.props.amount = amount
        this.props.updatedAt = new Date()
    }

    set type(type: 'income' | 'expense') {
        this.props.type = type
        this.props.updatedAt = new Date()
    }

    static create(props: Optional<TransactionProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityID) {
        const transaction = new Transaction({
            ...props,
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date()
        }, id)

        return transaction
    }
}

interface TransactionProps {
    amount: number
    type: 'income' | 'expense'
    description: string
    date: Date
    accountId: UniqueEntityID
    categoryId: UniqueEntityID
    createdAt: Date
    updatedAt: Date
}