import CreateJobService from "../services/job/CreateJobService";
import asyncHandler from "../utils/asyncHandler";



const createJob = asyncHandler(async (req, res) => {
    const result = await CreateJobService(req.body);
    res.status(200).json({
        success: true,
        message: "Job is published successfully",
        data: result
    })
})


const JobController = {
    createJob
}

export default JobController;