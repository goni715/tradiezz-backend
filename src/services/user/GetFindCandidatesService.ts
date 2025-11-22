import { EmployerSearchableFields } from "../../constant/user.constant";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { TEmployerQuery } from "../../interfaces/employer.interface";
import CandidateModel from "../../models/CandidateModel";

const GetFindCandidatesService = async (query: TEmployerQuery) => {
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters  // Any additional filters
  } = query;

  // 1. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //2. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //3. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, EmployerSearchableFields);
  }

  //4. setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await CandidateModel.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: "$user"
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
            userId:1,
            fullName:1,
            email:1,
            phone:1,
            profileImg:1,
            availableDate:1,
            address:1,
            experience:1,
            isPrivate: 1,
            ratings: '$ratings',
            totalReview: '$totalReview',
            status: "$user.status",
            createdAt: "$createdAt"
        }
    },
    {
      $match: {
        status: "active",
        ...searchQuery, 
        ...filterQuery
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ])
  .collation({ locale: "en", strength: 2 });

     // total count
  const totalCountResult = await CandidateModel.aggregate([
   {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: "$user"
    },
    {
        $project: {
            _id: 0,
            userId:1,
            fullName:1,
            email:1,
            phone:1,
            ratings: '$ratings',
            status: "$user.status",
            createdAt: "$createdAt"
        }
    },
    {
      $match: {
        status: "active",
        ...searchQuery, 
        ...filterQuery
      },
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result.length > 0 ? result?.map((item) => ({
            ...item,
            status: undefined,
            createdAt:undefined,
            phone: undefined
        })) : [],
    };
};

export default GetFindCandidatesService;