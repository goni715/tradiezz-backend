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


const UserRoute = router;
export default UserRoute;
