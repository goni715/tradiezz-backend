import express from "express";
import validationMiddleware from "../middlewares/validationMiddleware";
import ContactController from "../controllers/ContactController";
import { contactValidationSchema, replyContactValidationSchema } from "../validation/contact.validation";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { UserRole } from "../constant/user.constant";

const router = express.Router();


router.post(
  "/create-contact",
  validationMiddleware(contactValidationSchema),
  ContactController.createContact
);
router.get(
  '/get-contacts',
  AuthMiddleware(UserRole.admin, UserRole.superAdmin),
  ContactController.getContacts
);
router.patch(
  '/reply-contact/:contactId',
  AuthMiddleware(UserRole.admin, UserRole.superAdmin),
  validationMiddleware(replyContactValidationSchema),
  ContactController.replyContact
);
router.delete(
  '/delete-contact/:contactId',
  AuthMiddleware(UserRole.admin, UserRole.superAdmin),
  ContactController.deleteContact
);


const ContactRoute = router;
export default ContactRoute;
