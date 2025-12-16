import CustomError from "../../errors/CustomError";
import FaqModel from "../../models/Faq.model";
import isNotObjectId from "../../utils/isNotObjectId";

const DeleteFaqService = async (faqId: string) => {
    if (isNotObjectId(faqId)) {
        throw new CustomError(400, "faqId must be a valid ObjectId")
    }
    const faq = await FaqModel.findById(faqId);
    if (!faq) {
        throw new CustomError(404, "Faq Not Found with the provided ID");
    }

    const result = await FaqModel.deleteOne({ _id: faqId });
    return result;
};

export default DeleteFaqService;
