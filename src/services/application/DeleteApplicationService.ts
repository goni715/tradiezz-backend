import CustomError from "../../errors/CustomError";
import ApplicationModel from "../../models/ApplicationModel";
import isNotObjectId from "../../utils/isNotObjectId";

const DeleteApplicationService = async (loginEmployerUserId: string, applicationId: string) => {
    if (isNotObjectId(applicationId)) {
        throw new CustomError(400, "applicationId must be a valid ObjectId")
    }

    //check job
    const application = await ApplicationModel.findOne({
        _id: applicationId,
        employerUserId: loginEmployerUserId
    });
    if (!application) {
        throw new CustomError(404, 'Application not found with the provided ID');
    }


    //delete application
    const result = await ApplicationModel.deleteOne(
        {
            _id: applicationId,
            employerUserId: loginEmployerUserId
        }
    )

    return result;
}

export default DeleteApplicationService;