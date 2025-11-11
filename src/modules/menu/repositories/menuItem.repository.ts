import { AppDataSource } from "../../../../core/database/dataSource.js";
import { MenuItem } from "../entities/menuItem.entity.js";

export const MenuItemRepository = AppDataSource.getRepository(MenuItem);