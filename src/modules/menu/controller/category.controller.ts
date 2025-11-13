import type { Request, Response } from "express";
import { CategoryService } from "../service/category.service.js";

// Extend Request type to include tenantId
declare module "express-serve-static-core" {
  interface Request {
    tenantId: string;
  }
}

const service = new CategoryService();

export class CategoryController {
  async create(req: Request, res: Response) {
    try {
      const result = await service.createCategory(req.body, req.tenantId);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const result = await service.getAllCategory(req.tenantId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
      }
      const result = await service.updateCategory(id, req.body, req.tenantId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
      }
      await service.deleteCategory(id, req.tenantId);
      res.json({ message: "Deleted" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
