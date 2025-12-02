import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { UserRole } from "../constant/user.constant";
import ApplicationController from "../controllers/ApplicationController";
import validationMiddleware from "../middlewares/validationMiddleware";
import { applyJobSchema } from "../validation/application.validation";

const router = express.Router();

router.post(
  "/apply-job",
  AuthMiddleware(UserRole.candidate),
  validationMiddleware(applyJobSchema),
  ApplicationController.applyJob
);
router.get(
  "/get-applied-jobs",
  AuthMiddleware(UserRole.candidate),
  ApplicationController.getAppliedJobs
);
router.get(
  "/get-applications/:jobId",
  AuthMiddleware(UserRole.employer),
  ApplicationController.getApplications
);


const ApplicationRoute = router;
export default ApplicationRoute;
