import CustomError from "../../errors/CustomError";
import CategoryModel from "../../models/CategoryModel";
import JobModel from "../../models/Job.Model";
import SubCategoryModel from "../../models/SubCategoryModel";
import isNotObjectId from "../../utils/isNotObjectId";

const DeleteCategoryService = async (categoryId: string) => {
    if (isNotObjectId(categoryId)) {
        throw new CustomError(400, "categoryId must be a valid ObjectId")
    }
    const category = await CategoryModel.findById(categoryId)
    if(!category){
        throw new CustomError(404, 'This categoryId not found');
    }

    //check if categoryId is associated with subCategory
    const associatedWithSubCategory = await SubCategoryModel.findOne({
         categoryId
    });
    if(associatedWithSubCategory){
        throw new CustomError(409, 'Unable to delete, This category is associated with sub-category.');
    }

    //check if categoryId is associated with job
    const associatedWithJob = await JobModel.findOne({
         categoryId
    });
    if(associatedWithJob){
        throw new CustomError(409, 'Unable to delete, This category is associated with job.');
    }

    const result = await CategoryModel.deleteOne({ _id: categoryId})
    return result;
}

export default DeleteCategoryService;