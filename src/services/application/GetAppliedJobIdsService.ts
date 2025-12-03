import { Types } from "mongoose";
import ApplicationModel from "../../models/ApplicationModel";

const GetAppliedJobIdsService = async (loginCandidateUserId: string) => {
    
    const result = await ApplicationModel.aggregate([
        {
            $match: {
                candidateUserId: new Types.ObjectId(loginCandidateUserId)
            }
        },
    ])

    const modifiedResult = result.length > 0 ? result.map((cv)=> cv.jobId) : []
    return modifiedResult;
};

export default GetAppliedJobIdsService;