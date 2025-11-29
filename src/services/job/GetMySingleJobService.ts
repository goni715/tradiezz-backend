import { Types } from "mongoose";
import JobModel from "../../models/Job.Model";
import isNotObjectId from "../../utils/isNotObjectId";
import CustomError from "../../errors/CustomError";


const GetMySingleJobService = async (loginUserId: string, jobId: string) => {
    if (isNotObjectId(jobId)) {
        throw new CustomError(400, "jobId must be a valid ObjectId")
    }

    const result = await JobModel.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(jobId),
                userId: new Types.ObjectId(loginUserId)
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
            $project: {
                title: 1,
                categoryId: "$categoryId",
                "category": "$category.name",
                startDate: 1,
                endDate: 1,
                skills: 1,
                benefits: 1,
                deadline: 1,
                minRange: 1,
                maxRange: 1,
                postalCode: 1,
                experience: 1,
                jobType:1,
                rateType:1,
                description:1,
                address: "$address",
                coordinates: "$location.coordinates",
                status: '$status',
                createdAt: "$createdAt",
                updatedAt: "$updatedAt"
            }
        }
    ])
    
    if (result.length === 0) {
        throw new CustomError(404, 'jobId not found');
    }

    return result[0]
}

export default GetMySingleJobService;