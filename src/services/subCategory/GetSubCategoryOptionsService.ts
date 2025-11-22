import CustomError from "../../errors/CustomError";
import CategoryModel from "../../models/CategoryModel";
import SubCategoryModel from "../../models/SubCategoryModel";
import isNotObjectId from "../../utils/isNotObjectId";

const GetSubCategoryOptionsService = async (categoryId: string) => {
    if (isNotObjectId(categoryId)) {
        throw new CustomError(400, "categoryId must be a valid ObjectId")
    }

    //check category
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
        throw new CustomError(404, "categoryId Not Found");
    }

    const result = await SubCategoryModel.find({ categoryId }).select('_id name').sort('-createdAt');
    return result;
}

export default GetSubCategoryOptionsService;
