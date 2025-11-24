import express from "express";
import validationMiddleware from "../middlewares/validationMiddleware";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { createJobValidationSchema } from "../validation/job.validation";
import JobController from "../controllers/JobController";

const router = express.Router();


router.post(
  "/create-job",
  AuthMiddleware('employer'),
  validationMiddleware(createJobValidationSchema),
  JobController.createJob
);


const JobRoute = router;
export default JobRoute;
