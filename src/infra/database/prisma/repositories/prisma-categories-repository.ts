import { Injectable } from "@nestjs/common"
import { CategoriesRecipeRepository } from "@/domain/application/repositories/categories-recipe-repository"
import { CategoryRecipe } from "@/domain/enterprise/entities/category"
import { PrismaService } from "../prisma.service"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRecipeRepository {
  constructor(private prisma: PrismaService) {}

  async findAllByUserId(userId: string): Promise<CategoryRecipe[]> {
    const categories = await this.prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return categories.map((category) =>
      CategoryRecipe.create(
        {
          name: category.name,
          description: category.description,
          userId: new UniqueEntityID(category.userId),
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
        new UniqueEntityID(category.id)
      )
    )
  }

  async create(category: CategoryRecipe): Promise<void> {
    await this.prisma.category.create({
      data: {
        id: category.id.toString(),
        name: category.name,
        description: category.description,
        userId: category.userId.toString(),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    })
  }

  async findById(id: string): Promise<CategoryRecipe | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return null
    }

    return CategoryRecipe.create(
      {
        name: category.name,
        description: category.description,
        userId: new UniqueEntityID(category.userId),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      new UniqueEntityID(category.id)
    )
  }

  async findAll(): Promise<CategoryRecipe[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return categories.map((category) =>
      CategoryRecipe.create(
        {
          name: category.name,
          description: category.description,
          userId: new UniqueEntityID(category.userId),
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
        new UniqueEntityID(category.id)
      )
    )
  }

  async update(category: CategoryRecipe): Promise<void> {
    await this.prisma.category.update({
      where: { id: category.id.toString() },
      data: {
        name: category.name,
        description: category.description,
        userId: category.userId.toString(),
        updatedAt: category.updatedAt,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    })
  }
}

