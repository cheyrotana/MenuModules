import { AppDataSource } from "../../../../core/database/dataSource.js";
import { Category } from "../entities/category.entity.js";

export const categoryRepository = AppDataSource.getRepository(Category);
