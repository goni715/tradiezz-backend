import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { UserRole } from "../constant/user.constant";
import UserController from "../controllers/UserController";

const router = express.Router();

router.get(
  '/get-employers',
  AuthMiddleware(UserRole.admin, UserRole.superAdmin),
  UserController.getEmployers
);
router.get(
  '/get-candidates',
  AuthMiddleware(UserRole.admin, UserRole.superAdmin),
  UserController.getCandidates
);
router.get(
  '/get-find-candidates',
  AuthMiddleware(UserRole.employer),
  UserController.getFindCandidates
);
router.get(
  '/get-single-candidate/:userId',
  UserController.getSingleCandidate
);
router.get(
  '/get-my-profile',
  AuthMiddleware("admin", "superAdmin", "candidate", "employer"),
  UserController.getMyProfile
);


const UserRoute = router;
export default UserRoute;
