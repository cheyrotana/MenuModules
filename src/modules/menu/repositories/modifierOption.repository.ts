import { AppDataSource } from "../../../../core/database/dataSource.js";
import { ModifierOption } from "../entities/modifierOption.entity.js";

export const modifierOptionRepository = AppDataSource.getRepository(ModifierOption);