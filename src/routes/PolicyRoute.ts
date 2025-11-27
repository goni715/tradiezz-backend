import express from 'express';
import PolicyController from '../controllers/PolicyController';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import validationMiddleware from '../middlewares/validationMiddleware';
import { createPolicyValidationSchema } from '../validation/policy.validation';

const router = express.Router();

router.patch(
  '/create-update-policy',
  AuthMiddleware("admin", "superAdmin"),
  validationMiddleware(createPolicyValidationSchema),
  PolicyController.createUpdatePolicy,
);


router.get(
  '/get-policy-by-type/:type',
  PolicyController.getPolicyByType,
);


const PolicyRoute = router;
export default PolicyRoute;
