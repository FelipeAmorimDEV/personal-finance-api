import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Entity } from "@/core/entities/entities"
import { Optional } from "@/core/types/optional"
export class User extends Entity<UserProps> {
    get name() {
        return this.props.name
    }

    get email() {
        return this.props.email
    }

    get password() {
        return this.props.password
    }

    get role() {
        return this.props.role ?? undefined
    }

    get createdAt() {
        return this.props.createdAt
    }

    get avatar() {
        return this.props.avatar ?? ``
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    set name(name: string) {
        this.props.name = name
        this.props.updatedAt = new Date()
    }

    set email(email: string) {
        this.props.email = email
        this.props.updatedAt = new Date()
    }

    set password(password: string) {
        this.props.password = password
        this.props.updatedAt = new Date()
    }

    set role(role: string) {
        this.props.role = role
        this.props.updatedAt = new Date()
    }

    set avatar(avatar: string) {
        this.props.avatar = avatar
        this.props.updatedAt = new Date()
    }

  static create(props: Optional<UserProps, 'createdAt' | 'role' | 'avatar'>, id?: UniqueEntityID) {
    const user = new User({
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: props.role ?? 'user',
        avatar: props.avatar ?? undefined
    }, id)
    return user
  }
}

type UserProps = {
  name: string
  email: string
  password: string
  role: string
  createdAt: Date
  updatedAt?: Date
  avatar?: string            
}