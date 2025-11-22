import CategoryModel from "../../models/CategoryModel";

const GetCategoryDropDownService = async () => {
    const result = await CategoryModel.find({ status: "visible" }).select('_id name image').sort('-createdAt');
    return result;
}

export default GetCategoryDropDownService;