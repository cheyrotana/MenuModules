import { AppDataSource } from "../../../../core/database/dataSource.js";
import { MenuStockMap } from "../entities/menuStockMap.entity.js";

export const menuStockMapRepository = AppDataSource.getRepository(MenuStockMap);