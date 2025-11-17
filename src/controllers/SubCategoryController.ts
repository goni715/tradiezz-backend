import { SubCategoryValidFields } from "../constant/subCategory.constant";
import CreateSubCategoryService from "../services/subCategory/CreateSubCategoryService";
import GetSubCategoriesService from "../services/subCategory/GetSubCategoriesService";
import GetSubCategoryDropDownService from "../services/subCategory/GetSubCategoryDropDownService";
import asyncHandler from "../utils/asyncHandler";
import pickValidFields from "../utils/pickValidFields";

const createSubCategory = asyncHandler(async (req, res) => {
    const result = await CreateSubCategoryService(req.body);
    res.status(200).json({
        success: true,
        message: "Sub-category is created successfully",
        data: result
    })
})


const getSubCategories = asyncHandler(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, SubCategoryValidFields);
    const result = await GetSubCategoriesService(validatedQuery);
    res.status(200).json({
        success: true,
        message: 'Sub-categories are retrieved successfully',
        meta: result.meta,
        data: result.data
    })
})

const getSubCategoryDropDown = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const result = await GetSubCategoryDropDownService(categoryId as string);
    res.status(200).json({
        success: true,
        message: 'Sub-categories are retrieved successfully',
        data: result
    })
})


const SubCategoryController = {
    createSubCategory,
    getSubCategories,
    getSubCategoryDropDown
}

export default SubCategoryController