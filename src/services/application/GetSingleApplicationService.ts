import { Types } from "mongoose";
import CustomError from "../../errors/CustomError";
import ApplicationModel from "../../models/ApplicationModel";
import isNotObjectId from "../../utils/isNotObjectId";

const GetSingleApplicationService = async (
  loginEmployerUserId: string,
  applicationId: string,
) => {
  if (isNotObjectId(applicationId)) {
    throw new CustomError(400, "applicationId must be a valid ObjectId");
  }

  const result = await ApplicationModel.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(applicationId),
        employerUserId: new Types.ObjectId(loginEmployerUserId),
      },
    },
    {
      $lookup: {
        from: "candidates",
        localField: "candidateUserId",
        foreignField: "userId",
        as: "candidate",
      },
    },
    {
      $unwind: "$candidate",
    },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    {
      $unwind: "$job",
    },
    {
      $lookup: {
        from: "categories",
        localField: "job.categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    // {
    //     $lookup: {
    //         from: "employerreviews",
    //         let: {
    //             jobID: "$jobId",
    //             candidateUserID: "$candidateUserId",
    //             employerUserID: new Types.ObjectId(loginEmployerUserId),
    //         },
    //         pipeline: [
    //             {
    //                 $match: {
    //                     $expr: {
    //                         $and: [
    //                             { $eq: ["$jobId", "$$jobID"] },
    //                             { $eq: ["$candidateUserId", "$$candidateUserID"] },
    //                             { $eq: ["$employerUserId", "$$employerUserID"] },
    //                         ],
    //                     },
    //                 },
    //             },
    //             { $count: "count" },
    //         ],
    //         as: "employerReviewCount",
    //     },
    // },
    // {
    //     $addFields: {
    //         isEmployerReview: {
    //             $gt: [
    //                 { $ifNull: [{ $arrayElemAt: ["$employerReviewCount.count", 0] }, 0] },
    //                 0
    //             ]
    //         }
    //     }
    // },

    {
      $lookup: {
        from: "employerreviews",
        let: {
          jobID: "$jobId",
          candidateUserID: "$candidateUserId",
          employerUserID: new Types.ObjectId(loginEmployerUserId),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$jobId", "$$jobID"] },
                  { $eq: ["$candidateUserId", "$$candidateUserID"] },
                  { $eq: ["$employerUserId", "$$employerUserID"] },
                ],
              },
            },
          },
          {
            $project: {
              comment: 1,
              star: 1,
              _id: 0,
            },
          },
        ],
        as: "EmployerReviews",
      },
    },
    {
      $addFields: {
        isEmployerReview: { $gt: [{ $size: "$EmployerReviews" }, 0] },
        employerReviewDetails: {
          $cond: [
            { $gt: [{ $size: "$EmployerReviews" }, 0] },
            { $arrayElemAt: ["$EmployerReviews", 0] }, // use actual review
            null, //default null
            //{star: 0, comment: ""}, // default object if no review
          ],
        },
      },
    },

    //candidate reviews
    // {
    //   $lookup: {
    //     from: "candidatereviews",
    //     let: {
    //       jobID: "$jobId",
    //       candidateUserID: "$candidateUserId",
    //       employerUserID: new Types.ObjectId(loginEmployerUserId),
    //     },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [
    //               { $eq: ["$jobId", "$$jobID"] },
    //               { $eq: ["$candidateUserId", "$$candidateUserID"] },
    //               { $eq: ["$employerUserId", "$$employerUserID"] },
    //             ],
    //           },
    //         },
    //       },
    //       { $count: "count" },
    //     ],
    //     as: "candidateReviewCount",
    //   },
    // },
    // {
    //   $addFields: {
    //     isCandidateReview: {
    //       $gt: [
    //         {
    //           $ifNull: [
    //             { $arrayElemAt: ["$candidateReviewCount.count", 0] },
    //             0,
    //           ],
    //         },
    //         0,
    //       ],
    //     },
    //   },
    // },
    {
      $lookup: {
        from: "candidatereviews",
        let: {
          jobID: "$jobId",
          candidateUserID: "$candidateUserId",
          employerUserID: new Types.ObjectId(loginEmployerUserId),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$jobId", "$$jobID"] },
                  { $eq: ["$candidateUserId", "$$candidateUserID"] },
                  { $eq: ["$employerUserId", "$$employerUserID"] },
                ],
              },
            },
          },
          {
            $project: {
              comment: 1,
              star: 1,
              _id: 0,
            },
          },
        ],
        as: "CandidateReviews",
      },
    },
    {
      $addFields: {
        isCandidateReview: { $gt: [{ $size: "$CandidateReviews" }, 0] },
        candidateReviewDetails: {
          $cond: [
            { $gt: [{ $size: "$CandidateReviews" }, 0] },
            { $arrayElemAt: ["$CandidateReviews", 0] }, // use actual review
            //null, //default null
            {star: 0, comment: ""}, // default object if no review
          ],
        },
      },
    },
    {
      $project: {
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
        benefits: "$job.benefits",
        skills: "$job.skills",
        candidateUserId: "$candidateUserId",
        candidateName: "$candidate.fullName",
        candidateEmail: "$candidate.email",
        candidatePhone: "$candidate.phone",
        candidateImg: "$candidate.profileImg",
        candidateDescription: "$candidate.description",
        candidateCV: "$cv",
        status: "$status",
        workStatus: "$workStatus",
        isMyReview: "$isEmployerReview",
        myReviewDetails: "$employerReviewDetails",
        isCandidateReview: "$isCandidateReview",
        candidateReviewDetails: "$candidateReviewDetails",
        createdAt: "$createdAt",
      },
    },
  ]);

  if (result.length === 0) {
    throw new CustomError(404, "Application not found with the provided ID");
  }

  return result[0];
};

export default GetSingleApplicationService;
