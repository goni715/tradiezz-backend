import { Types } from "mongoose";
import { TUserRole } from "../../interfaces/user.interface";
import CandidateModel from "../../models/CandidateModel";
import EmployerModel from "../../models/EmployerModel";
import UserModel from "../../models/UserModel";


const GetMyProfileService = async (userId: string, role: TUserRole) => {

    //if role is candidate
    if(role==="candidate"){
        const result = await CandidateModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subcategory"
                }
            },
            {
                $unwind: "$subcategory"
            },
            {
                $lookup: {
                    from: "reviews",
                    let: { uid: "$userId" },   //$$uid // <-- variable created here
                    pipeline: [
                        { $match: { $expr: { $eq: ["$userId", "$$uid"] } } },
                        { $count: "count" },
                    ],
                    as: "reviewCount"
                }
            },
            {
                $addFields: {
                    totalReview: {
                        $ifNull: [{ $arrayElemAt: ["$reviewCount.count", 0] }, 0]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: 1,
                    fullName: 1,
                    email: 1,
                    phone: 1,
                    profileImg: 1,
                    availableDate: 1,
                    workRate: 1,
                    workType: 1,
                    employmentType: 1,
                    skills: 1,
                    experience: 1,
                    categoryId: "$categoryId",
                    category: "$category.name",
                    subCategoryId: "$subcategory._id",
                    subCategory: "$subcategory.name",
                    address: "$address",
                    coordinates: "$location.coordinates",
                    ratings: "$ratings",
                    totalReview: "$totalReview",
                }
            },
        ]);

        return result[0];
    }


    //if role is employer
    if(role==="employer"){
        const result = await EmployerModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    let: { uid: "$userId" },   //$$uid // <-- variable created here
                    pipeline: [
                        { $match: { $expr: { $eq: ["$userId", "$$uid"] } } },
                        { $count: "count" },
                    ],
                    as: "reviewCount"
                }
            },
            {
                $addFields: {
                    totalReview: {
                        $ifNull: [{ $arrayElemAt: ["$reviewCount.count", 0] }, 0]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: 1,
                    fullName: 1,
                    email: 1,
                    phone: 1,
                    profileImg: 1,
                    ratings: "$ratings",
                    totalReview: "$totalReview",
                }
            },
        ]);

        return result[0];
    }

    if(role === "superAdmin"){
        const result = await UserModel.findOne({ _id:userId, role: "superAdmin"});
        return {
            fullName: "Super Admin",
            email: result?.email,
            profileImg: ""
        }
    }

    return null;
}

export default GetMyProfileService;