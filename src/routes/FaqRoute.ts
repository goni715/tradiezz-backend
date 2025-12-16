import express from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import { createFaqValidationSchema, updateFaqValidationSchema } from '../validation/faq.validation';
import validationMiddleware from '../middlewares/validationMiddleware';
import FaqController from '../controllers/FaqController';

const router = express.Router();

router.post(
  '/create-Faq',
  AuthMiddleware("superAdmin", "admin"),
  validationMiddleware(createFaqValidationSchema),
  FaqController.createFaq,
);
router.get(
  '/get-faqs',
  AuthMiddleware("superAdmin", "admin"),
  FaqController.getFaqs
);
router.get(
  '/get-user-faqs',
  FaqController.getUserFaqs
);
router.patch(
  '/update-faq/:faqId',
  AuthMiddleware("superAdmin", "admin"),
  validationMiddleware(updateFaqValidationSchema),
  FaqController.updateFaq,
);
router.delete(
  '/delete-faq/:faqId',
  AuthMiddleware("superAdmin", "admin"),
  FaqController.deleteFaq,
);



const FaqRoute = router;
export default FaqRoute;