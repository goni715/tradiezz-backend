import CustomError from "../../errors/CustomError";
import { ISubCategory } from "../../interfaces/subCategory.interface";
import CategoryModel from "../../models/CategoryModel";
import SubCategoryModel from "../../models/SubCategoryModel";
import convertToSlug from "../../utils/convertToSlug";


const CreateSubCategoryService = async (payload: ISubCategory) => {
    const { name, categoryId } = payload;
    const slug = convertToSlug(name);

    //check category
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
        throw new CustomError(404, 'This categoryId not found');
    }

    //check category is already existed
    const subCategory = await SubCategoryModel.findOne({
        categoryId,
        slug
    });
    
    if (subCategory) {
        throw new CustomError(409, 'This sub-category is already exists under the selected category.');
    }

    const result = await SubCategoryModel.create({
        categoryId,
        name,
        slug
    })
    return result;
}

export default CreateSubCategoryService;
