import CustomError from "../../errors/CustomError";
import FavoriteJobModel from "../../models/FavoriteJobModel";
import JobModel from "../../models/Job.Model";
import isNotObjectId from "../../utils/isNotObjectId";


const AddRemoveFavoriteJobService = async (
    loginCandidateUserId: string,
    jobId: string
) => {

    if (isNotObjectId(jobId)) {
        throw new CustomError(400, "jobId must be a valid ObjectId")
    }
    //check job
    const job = await JobModel.findById(jobId);
    if (!job) {
        throw new CustomError(404, "jobId Not Found");
    }

    if (job.status ==="hidden") {
        throw new CustomError(404, "Sorry, This Job is hidden");
    }

    //cheack job is already existed to favourite list
    const favourite = await FavoriteJobModel.findOne({
        candidateUserId: loginCandidateUserId,
        jobId
    })


    let result;
    let message;

    //if exist, remove it
    if (favourite) {
        result = await FavoriteJobModel.deleteOne({ _id: favourite._id })
        message = "Job removed from your favorites list";
    }


    //if not exist, create a new one
    if (!favourite) {
        result = await FavoriteJobModel.create({
            candidateUserId: loginCandidateUserId,
            jobId
        })
        message = "Job added to your favorites list";
    }

    return {
        message,
        data: result
    }

};

export default AddRemoveFavoriteJobService;