import { AppDataSource } from "../../../../core/database/dataSource.js";
import { Modifier } from "../entities/modifier.entity.js";

export const modifierRepository = AppDataSource.getRepository(Modifier);
