import { Types } from "mongoose";
import { SubCategorySearchableFields } from "../../constant/subCategory.constant";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import SubCategoryModel from "../../models/SubCategoryModel";
import { ISubCategoryQuery } from "../../interfaces/subCategory.interface";

const GetSubCategoriesService = async (query: ISubCategoryQuery) => {
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        categoryId,
        ...filters  // Any additional filters
    } = query;


    // 1. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, SubCategorySearchableFields);
    }

    //4. setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }

    //if categoryId is available
    if(categoryId){
        filterQuery = {
            ...filterQuery,
            categoryId: new Types.ObjectId(categoryId)
        } 
    }

    const result = await SubCategoryModel.aggregate([
        {
            $match: {
                ...searchQuery,
                ...filterQuery,     
            },
        },
        {
            $lookup : {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        { $sort: { [sortBy]: sortDirection } },
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: "$categoryId",
                categoryName: "$category.name",
                status: "$status"
            },
        },
        { $skip: skip },
        { $limit: Number(limit) },
    ]).collation({ locale: "en", strength: 2 });

    // total count
    const totalCountResult = await SubCategoryModel.aggregate([
        {
            $match: {
                ...searchQuery,
                ...filterQuery
            }
        },
        { $count: "totalCount" }
    ])

    const totalCount = totalCountResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));

    return {
        meta: {
            page: Number(page), //currentPage
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result,
    };
};

export default GetSubCategoriesService;