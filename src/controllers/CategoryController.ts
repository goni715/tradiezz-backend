import { CategoryValidFields } from "../constant/category.constant";
import CreateCategoryService from "../services/category/CreateCategoryService";
import GetCategoriesService from "../services/category/GetCategoriesService";
import asyncHandler from "../utils/asyncHandler";
import pickValidFields from "../utils/pickValidFields";


const createCategory = asyncHandler(async (req, res) => {
    const result = await CreateCategoryService(req, req.body);
    res.status(200).json({
        success: true,
        message: "Category is created successfully",
        data: result
    })
})

const getCategories = asyncHandler(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, CategoryValidFields);
    const result = await GetCategoriesService(validatedQuery);
    res.status(200).json({
        success: true,
        message: 'Categories are retrieved successfully',
        meta: result.meta,
        data: result.data
    })
})




const CategoryController = {
    createCategory,
    getCategories
}

export default CategoryController