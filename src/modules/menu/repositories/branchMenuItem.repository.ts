import { AppDataSource } from "../../../../core/database/dataSource.js";
import { BranchMenuItem } from "../entities/branchMenuItem.entity.js";

export const branchMenuItemRepository = AppDataSource.getRepository(BranchMenuItem);
