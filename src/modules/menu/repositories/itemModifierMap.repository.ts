import { AppDataSource } from "../../../../core/database/dataSource.js";
import { ItemModifierMap } from "../entities/itemModifierMap.entity.js";

export const itemModifierMapRepository = AppDataSource.getRepository(ItemModifierMap);
