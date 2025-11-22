import CategoryModel from "../../models/CategoryModel";

const GetCategoryOptionsService = async () => {
    const result = await CategoryModel.find().select('_id name').sort('-createdAt');
    return result;
}

export default GetCategoryOptionsService;