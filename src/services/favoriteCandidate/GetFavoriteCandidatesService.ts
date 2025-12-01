import { Types } from "mongoose";
import { FavouriteCandidateSearchFields } from "../../constant/favoriteCandidate.constant";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import FavoriteCandidateModel from "../../models/FavoriteCandidateModel";
import { TFavoriteCandidateQuery } from "../../interfaces/favouriteCandidate.interface";

const GetFavoriteCandidateService = async (loginEmployerUserId: string, query: TFavoriteCandidateQuery) => {

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
    searchQuery = makeSearchQuery(searchTerm, FavouriteCandidateSearchFields);
  }



  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }



  const result = await FavoriteCandidateModel.aggregate([
    {
      $match: { employerUserId: new Types.ObjectId(loginEmployerUserId) }
    },
    {
      $lookup: {
        from: "candidates",
        localField: "candidateUserId",
        foreignField: "userId",
        as: "candidate"
      }
    },
    {
      $unwind: "$candidate"
    },
    {
      $lookup: {
        from: "users",
        localField: "candidateUserId",
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
      $lookup: {
        from: "favoritecandidates",
        let: { candidateUserId: "$candidateUserId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$candidateUserId", "$$candidateUserId"] },
                  { $eq: ["$employerUserId", new Types.ObjectId(loginEmployerUserId)] }
                ]
              }
            }
          }
        ],
        as: "favorites",
      }
    },
    {
      $addFields: {
        totalReview: {
          $ifNull: [{ $arrayElemAt: ["$reviewCount.count", 0] }, 0]
        },
        isFavorite: {
          $cond: [{ $gt: [{ $size: "$favorites" }, 0] }, true, false],
        }
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    {
      $project: {
        _id: 0,
        userId: "$candidateUserId",
        fullName: "$candidate.fullName",
        profileImg: "$candidate.profileImg",
        email: "$candidate.email",
        phone: "$candidate.phone",
        availableDate: "$candidate.availableDate",
        address: "$candidate.address",
        experience: "$candidate.experience",
        isPrivate: "$candidate.isPrivate",
        isFavorite: "$isFavorite",
        ratings: '$candidate.ratings',
        status: "$user.status",
        totalReview: '$totalReview',
      }
    },
    {
      $match: {
        status: "active",
        ...searchQuery,
        ...filterQuery
      }
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);


  //count total for pagination
  const totalResultCount = await FavoriteCandidateModel.aggregate([
    {
      $match: { employerUserId: new Types.ObjectId(loginEmployerUserId) }
    },
    {
      $lookup: {
        from: "candidates",
        localField: "candidateUserId",
        foreignField: "userId",
        as: "candidate"
      }
    },
    {
      $unwind: "$candidate"
    },
    {
      $lookup: {
        from: "users",
        localField: "candidateUserId",
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
      $lookup: {
        from: "favoritecandidates",
        let: { candidateUserId: "$candidateUserId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$candidateUserId", "$$candidateUserId"] },
                  { $eq: ["$employerUserId", new Types.ObjectId(loginEmployerUserId)] }
                ]
              }
            }
          }
        ],
        as: "favorites",
      }
    },
    {
      $addFields: {
        totalReview: {
          $ifNull: [{ $arrayElemAt: ["$reviewCount.count", 0] }, 0]
        },
        isFavorite: {
          $cond: [{ $gt: [{ $size: "$favorites" }, 0] }, true, false],
        }
      }
    },
    {
      $project: {
        _id: 0,
        userId: "$candidateUserId",
        fullName: "$candidate.fullName",
        profileImg: "$candidate.profileImg",
        email: "$candidate.email",
        phone: "$candidate.phone",
        availableDate: "$candidate.availableDate",
        address: "$candidate.address",
        experience: "$candidate.experience",
        isPrivate: "$candidate.isPrivate",
        isFavorite: "$isFavorite",
        ratings: '$candidate.ratings',
        totalReview: '$totalReview',
        status: "$user.status",
      }
    },
    {
      $match: {
        status: "active",
        ...searchQuery,
        ...filterQuery
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
    data: result.length > 0 ? result?.map((item) => ({
      ...item,
      status: undefined,
      phone: undefined
    })) : [],
  };

}





export default GetFavoriteCandidateService