import { Category } from "../entities/category.entity.js";
import { categoryRepository } from "../repositories/category.repository.js";

export class CategoryService {
  async createCategory(
    dto: { name: string; description?: string },
    tenantId: string
  ) {
    if (!dto.name) {
      throw new Error("Category name is required.");
    }

    const existingexistingCategories = await categoryRepository.findOne({
      where: { name: dto.name, tenantId },
    });

    if (existingexistingCategories) {
      throw new Error("Category name already exist.");
    }

    const category = categoryRepository.create({
      name: dto.name,
      description: dto.description || "",
      tenantId,
    });

    await categoryRepository.save(category);
  }

  async getAllCategory(tenantId: string) {
    const categories = await categoryRepository.find({
      where: { tenantId },
      order: { createdAt: "ASC" },
    });

    return categories;
  }

  async updateCategory(
    categoryId: string,
    dto: { name: string; description?: string },
    tenantId: string
  ) {
    const existingexistingCategory = await categoryRepository.findOne({
      where: { id: categoryId, tenantId: tenantId },
    });

    if (!existingexistingCategory) {
      throw new Error("Category not found.");
    }

    const category = categoryRepository.create({
      name: dto.name,
      description: dto.description || "",
      tenantId,
    });

    await categoryRepository.save(category);
  }

  async deleteCategory(categoryId: string, tenantId: string) {
    const existingexistingCategory = await categoryRepository.findOne({
      where: { id: categoryId, tenantId: tenantId },
    });

    if (!existingexistingCategory) {
      throw new Error("No category found.");
    }

    await categoryRepository.remove(existingexistingCategory);
  }
}
