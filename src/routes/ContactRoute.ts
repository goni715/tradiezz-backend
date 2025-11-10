import express from "express";
import validationMiddleware from "../middlewares/validationMiddleware";
import ContactController from "../controllers/ContactController";
import { contactValidationSchema } from "../validation/contact.validation";

const router = express.Router();


router.post(
  "/create-contact",
  validationMiddleware(contactValidationSchema),
  ContactController.createContact
);



const ContactRoute = router;
export default ContactRoute;
