import { Types } from "mongoose";
import JobModel from "../../models/Job.Model";
import isNotObjectId from "../../utils/isNotObjectId";
import CustomError from "../../errors/CustomError";


const GetSingleJobService = async (jobId: string) => {
    if (isNotObjectId(jobId)) {
        throw new CustomError(400, "jobId must be a valid ObjectId")
    }

    const result = await JobModel.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(jobId),
                status: "visible"
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
                userId:1,
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
        throw new CustomError(404, 'Job not found or job is hidden');
    }

    const categoryId = result[0].categoryId;

    const relatedJobs = await JobModel.aggregate([
        {
            $match: {
                categoryId: new Types.ObjectId(categoryId as string),
                status: "visible"
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
                deadline: 1,
                minRange: 1,
                maxRange: 1,
                address: 1,
                postalCode: 1,
                experience: 1,
                jobType:1,
                rateType:1,
                createdAt: "$createdAt",
                updatedAt: "$updatedAt"
            }
        },
        { $sort: { createdAt: -1 } },
        { $limit: 6 },
    ])
    


    return {
        job: result[0],
        relatedJobs
    }
    
}

export default GetSingleJobService;