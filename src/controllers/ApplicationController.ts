import { APPLICATION_VALID_Fields } from "../constant/application.constant";
import ApplyJobService from "../services/application/ApplyJobService";
import GetApplicationsService from "../services/application/GetApplicationsService";
import GetAppliedJobsService from "../services/application/GetAppliedJobsService";
import asyncHandler from "../utils/asyncHandler";
import pickValidFields from "../utils/pickValidFields";



const applyJob = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await ApplyJobService(userId as string, req.body);
    res.status(200).json({
        success: true,
        message: "Applied successfully",
        data: result
    })
})

const getAppliedJobs = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const validatedQuery = pickValidFields(req.query, APPLICATION_VALID_Fields);
    const result = await GetAppliedJobsService(userId as string, validatedQuery);
    res.status(200).json({
        success: true,
        message: 'Applied jobs are retrieved successfully',
        meta: result.meta,
        data: result.data
    })
})

const getApplications = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const { jobId } = req.params;
    const validatedQuery = pickValidFields(req.query, APPLICATION_VALID_Fields);
    const result = await GetApplicationsService(userId as string, jobId as string, validatedQuery);
    res.status(200).json({
        success: true,
        message: 'Applied jobs are retrieved successfully',
        meta: result.meta,
        data: result.data
    })
})

const ApplicationController = {
    applyJob,
    getAppliedJobs,
    getApplications
}

export default ApplicationController;