import { Types } from "mongoose";
import FavoriteJobModel from "../../models/FavoriteJobModel";

const GetFavoriteJobIdListService = async (loginCandidateUserId: string) => {
    const result = await FavoriteJobModel.aggregate([
        {
            $match: { 
                candidateUserId: new Types.ObjectId(loginCandidateUserId),
            }
        }
    ]);

    const modifiedResult = result.length > 0 ? result.map((cv)=> cv.jobId) : []
    return modifiedResult;
}



export default GetFavoriteJobIdListService;