import { categoryRepository } from "../repositories/category.repository.js";

export class CategoryService {
    async createCategory(dto: {name: string, description?: string}, tenantId: string) {
        if(!dto.name) {
            throw new Error ('Category name is required.');
        }

        const existingexistingCategories = await categoryRepository.findOne({where: {name: dto.name, tenantId}});

        if(!existingexistingCategories) {
            
        }
    }       

    async getAllCategory(tenantId: string) {
        const existingCategories =  await categoryRepository.find( { where: {tenantId} });
        if(!existingCategories) {
            console.log("There are no Category. Try creating a category first!");
        }
        else {
            return existingCategories;
        }
    }

    async updateCategory(id: string, dto: any) {
        const existingCategories  = await categoryRepository.findOne({where: {id}});
        if(!existingCategories) {
            console.log('There are no Category to update.');
        }
        else {

        }
        
    }

    async deleteCategory(id: string) {

    }
}