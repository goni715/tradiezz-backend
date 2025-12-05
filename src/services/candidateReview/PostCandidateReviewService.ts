/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from "mongoose";
import CustomError from "../../errors/CustomError";
import { IEmployerReview } from "../../interfaces/employerReview.interface";
import ApplicationModel from "../../models/ApplicationModel";
import EmployerReviewModel from "../../models/EmployerReviewModel";
import CandidateModel from "../../models/CandidateModel";
import JobModel from "../../models/Job.Model";


const PostCandidateReviewService = async (loginEmployerUserId: string, payload: IEmployerReview) => {
    const { jobId, candidateUserId } = payload;

    return loginEmployerUserId;

    //check job
    const job = await JobModel.findById(jobId);
    if (!job) {
        throw new CustomError(404, 'jobId not found');
    }

    //check candidate
    const candidate = await CandidateModel.findOne({
        userId: candidateUserId
    });
    if (!candidate) {
        throw new CustomError(404, "Candidate Not Found with this provided ID");
    }

    //check application
    const application = await ApplicationModel.findOne({
        jobId,
        employerUserId: loginEmployerUserId,
        candidateUserId
    });

    if (!application) {
        throw new CustomError(404, 'Applied job not found');
    }

    //check status
    if(application.status !== "accepted"){
        throw new CustomError(400,  "You can only review a candidate whose application has been accepted.")
    }

    //check workStatus
    if(application.workStatus !== "completed"){
        throw new CustomError(400, "You can only submit a review after the job is completed.")
    }

    // //check already provided review
    const review = await EmployerReviewModel.findOne({
        jobId,
        employerUserId: loginEmployerUserId,
        candidateUserId
    })
    if(review){
        throw new CustomError(409, "You have already submitted a review for this candidate on this job.");
    }


    //transaction & rollback
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        //post review
        await EmployerReviewModel.create([{
            ...payload,
            employerUserId: loginEmployerUserId
        }], { session })


        //count average rating
        const averageRatingResult = await EmployerReviewModel.aggregate([
            {
                $match: {
                    candidateUserId: new Types.ObjectId(candidateUserId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$star"
                    },
                }
            }
        ],
        { session })

        const averageRating =
            averageRatingResult.length > 0
                ? Number((averageRatingResult[0].averageRating).toFixed(1))
                : candidate.ratings;


        //update candidate rating
        await CandidateModel.updateOne(
            { userId: candidateUserId },
            { 
                ratings: averageRating, 
                $inc: { totalReviews: 1 }
            },
            { session, runValidators: true }
        )

        //transaction success
        await session.commitTransaction();
        await session.endSession();
        return null;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
}

export default PostCandidateReviewService