import CustomError from "../../errors/CustomError";
import { IJobPayload } from "../../interfaces/job.interface";
import CategoryModel from "../../models/CategoryModel";
import JobModel from "../../models/Job.Model";


const CreateJobService = async (payload: IJobPayload) => {
    const { categoryId, longitude, latitude } = payload;

    //check categoryId
    const category = await CategoryModel.findById(categoryId)
    if (!category) {
        throw new CustomError(404, 'This categoryId not found');
    }

    //location coordinates
    payload.location = {
        type: "Point",
        coordinates: [longitude, latitude]
    }

    //create job
    const result = await JobModel.create(payload);
    return result;
}

export default CreateJobService;