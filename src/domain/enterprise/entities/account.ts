import { Entity } from "@/core/entities/entities";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export class Account extends Entity<AccountProps>       {

   get userId() {
    return this.props.userId
   }

   get name() {
    return this.props.name
   }

   get balance() {
    return this.props.balance
   }

   get color() {
    return this.props.color
   }

   get icon() {
    return this.props.icon
   }

   get createdAt() {
    return this.props.createdAt
   }

   get updatedAt() {
    return this.props.updatedAt
   }

   updateBalance(balance: number) {
    this.props.balance = balance
    this.props.updatedAt = new Date()
   }

   static create(props: Optional<AccountProps, 'createdAt' | 'updatedAt' | 'color' | 'icon'>, id?: UniqueEntityID) {
    const account = new Account({
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        color: props.color ?? '#000000',
        icon: props.icon ?? '🍔'
    }, id)

    return account
   }
}

interface AccountProps {
    userId: UniqueEntityID
    name: string
    balance: number
    color: string
    icon: string
    createdAt: Date
    updatedAt: Date
}

