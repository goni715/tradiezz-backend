import { FavoriteJobValidFields } from "../constant/favoriteJob.constant";
import AddRemoveFavoriteJobService from "../services/favoriteJob/AddRemoveFavoriteJobService";
import GetFavoriteJobsService from "../services/favoriteJob/GetFavoriteJobsService";
import asyncHandler from "../utils/asyncHandler";
import pickValidFields from "../utils/pickValidFields";

const addRemoveFavoriteJob = asyncHandler(async (req, res) => {
    const { userId: loginCandidateUserId } = req.headers;
    const { jobId } = req.body;
    const result = await AddRemoveFavoriteJobService(loginCandidateUserId as string, jobId);
    res.status(200).json({
        success: true,
        message: result.message as string,
        data: result.data,
    })
})


const getFavoriteJobs= asyncHandler(async (req, res) => {
    const { userId:loginCandidateUserId } = req.headers;
    const validatedQuery = pickValidFields(req.query, FavoriteJobValidFields);
    const result = await GetFavoriteJobsService(loginCandidateUserId as string, validatedQuery);
    res.status(200).json({
        success: true,
        message: 'Favorite jobs are retrieved successfully',
        meta: result.meta,
        data: result.data
    })
})

const FavoriteJobController = {
    addRemoveFavoriteJob,
    getFavoriteJobs
}

export default FavoriteJobController;