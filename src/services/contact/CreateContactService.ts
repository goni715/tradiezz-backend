import { IContact } from "../../interfaces/contact.interface";
import ContactModel from "../../models/ContactModel";

const CreateContactService = async (payload: IContact) => {
    const result = await ContactModel.create(payload);
    return result;
};

export default CreateContactService;

