import CustomError from "../../errors/CustomError";
import { IJobPayload } from "../../interfaces/job.interface";
import JobModel from "../../models/Job.Model";
import isNotObjectId from "../../utils/isNotObjectId";


const UpdateJobStatusService = async (jobId: string, payload: Partial<IJobPayload>) => {

    if (isNotObjectId(jobId)) {
        throw new CustomError(400, "jobId must be a valid ObjectId")
    }

    //check job
    const job = await JobModel.findOne({ _id: jobId });
    if (!job) {
        throw new CustomError(404, 'jobId not found');
    }

   
    //update job
    const result = await JobModel.updateOne(
        { _id: jobId },
        payload
    );
    return result;
}

export default UpdateJobStatusService;