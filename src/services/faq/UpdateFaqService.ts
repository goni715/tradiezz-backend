import CustomError from "../../errors/CustomError";
import { IFaq } from "../../interfaces/faq.interface";
import FaqModel from "../../models/Faq.model";
import convertToSlug from "../../utils/convertToSlug";
import isNotObjectId from "../../utils/isNotObjectId";

const UpdateFaqService = async (faqId: string, payload: Partial<IFaq>) => {
    if (isNotObjectId(faqId)) {
        throw new CustomError(400, "faqId must be a valid ObjectId")
    }
    const faq = await FaqModel.findById(faqId);
    if (!faq) {
        throw new CustomError(404, "Faq Not Found with the provided ID");
    }

    if (payload?.question) {
        const slug = convertToSlug(payload.question);
        payload.slug = slug;
        const faqExist = await FaqModel.findOne({
            _id: { $ne: faqId },
            slug
        });
        if (faqExist) {
            throw new CustomError(409, "Sorry! This Question is already existed");
        }
    }

    const result = await FaqModel.updateOne(
        { _id: faqId },
        payload,
        { runValidators: true }
    );

    return result;
};

export default UpdateFaqService;