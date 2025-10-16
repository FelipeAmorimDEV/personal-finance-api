import { Entity } from "@/core/entities/entities"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"               
import { Optional } from "@/core/types/optional"

export class CategoryRecipe extends Entity<CategoryRecipeProps> {

  get userId() {
    return this.props.userId
  }

    get color() {
        return this.props.color
    }

    get icon() {
        return this.props.icon
    }

    get name() {
        return this.props.name
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    set name(name: string) {
        this.props.name = name
        this.props.updatedAt = new Date()
    }
    get description() {
        return this.props.description
    }

    set description(description: string) {
        this.props.description = description
        this.props.updatedAt = new Date()
    }



  static create(props: Optional<CategoryRecipeProps, 'createdAt' | 'color' | 'icon'>, id?: UniqueEntityID) {
    const category = new CategoryRecipe({
        ...props,
        createdAt: props.createdAt ?? new Date(),
        color: props.color ?? '#000000',
        icon: props.icon ?? '🍔',
    }, id)
    return category
  }
}

type CategoryRecipeProps = {
  userId: UniqueEntityID
  name: string
  description: string
  color: string
  icon: string
  createdAt: Date
  updatedAt?: Date
}