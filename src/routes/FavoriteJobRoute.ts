import express from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import { UserRole } from '../constant/user.constant';
import validationMiddleware from '../middlewares/validationMiddleware';
import FavoriteJobController from '../controllers/FavoriteJobController';
import { addRemoveFavoriteJobSchema } from '../validation/favoriteJob.validation';

const router = express.Router();

router.post(
  '/add-remove-favorite-job',
  AuthMiddleware(UserRole.candidate),
  validationMiddleware(addRemoveFavoriteJobSchema),
  FavoriteJobController.addRemoveFavoriteJob
);

router.get(
  '/get-favorite-jobs', 
  AuthMiddleware(UserRole.candidate),
  FavoriteJobController.getFavoriteJobs
);
router.get(
  '/get-favorite-job-id-list', 
  AuthMiddleware(UserRole.candidate),
  FavoriteJobController.getFavoriteJobIdList
);


const FavoriteJobRoute = router;
export default FavoriteJobRoute;