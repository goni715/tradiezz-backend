import { Types } from "mongoose";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { TFavoriteJobQuery } from "../../interfaces/favoriteJob.interface";
import { FavoriteJobSearchFields } from "../../constant/favoriteJob.constant";
import FavoriteJobModel from "../../models/FavoriteJobModel";

const GetFavoriteJobsService = async (loginCandidateUserId: string, query: TFavoriteJobQuery) => {

    // 1. Extract query parameters
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        ...filters // Any additional filters
    } = query;


    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, FavoriteJobSearchFields);
    }



    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }



    const result = await FavoriteJobModel.aggregate([
        {
            $match: { 
                candidateUserId: new Types.ObjectId(loginCandidateUserId),
            }
        },
        {
            $lookup: {
                from: "jobs",
                localField: "jobId",
                foreignField: "_id",
                as: "job"
            }
        },
        {
            $unwind: "$job"
        },
        {
            $lookup: {
                from: "categories",
                localField: "job.categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
       {
            $project: {
                _id:0,
                jobId: "$jobId",
                title: "$job.title",
                category: "$category.name",
                startDate: "$job.startDate",
                endDate: "$job.endDate",
                deadline: "$job.deadline",
                minRange: "$job.minRange",
                maxRange: "$job.maxRange",
                address: "$job.address",
                postalCode: "$job.postalCode",
                experience: "$job.experience",
                jobType: "$job.jobType",
                rateType: "$job.rateType",
                status: "$job.status",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt"
            }
        },
        {
            $match: {
                ...searchQuery,
                ...filterQuery,
                status: "visible"
            }
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);


    //count total for pagination
    const totalResultCount = await FavoriteJobModel.aggregate([
         {
            $match: { 
                candidateUserId: new Types.ObjectId(loginCandidateUserId),
            }
        },
        {
            $lookup: {
                from: "jobs",
                localField: "jobId",
                foreignField: "_id",
                as: "job"
            }
        },
        {
            $unwind: "$job"
        },
         {
            $lookup: {
                from: "categories",
                localField: "job.categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $project: {
                title: "$job.title",
                category: "$category.name",
                startDate: "$job.startDate",
                endDate: "$job.endDate",
                deadline: "$job.deadline",
                minRange: "$job.minRange",
                maxRange: "$job.maxRange",
                address: "$job.address",
                postalCode: "$job.postalCode",
                experience: "$job.experience",
                jobType: "$job.jobType",
                rateType: "$job.rateType",
                status: "$job.status",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt"
            }
        },
        {
            $match: {
                ...searchQuery,
                ...filterQuery,
                status: "visible"
            }
        },
        { $count: "totalCount" },
    ]);


    const totalCount = totalResultCount[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));


    return {
        meta: {
            page: Number(page), //currentPage
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result
    };

}



export default GetFavoriteJobsService