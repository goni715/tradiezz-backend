import { ContactValidFields } from "../constant/contact.constant";
import CreateContactService from "../services/contact/CreateContactService";
import DeleteContactService from "../services/contact/DeleteContactService";
import GetContactsService from "../services/contact/GetContactsService";
import ReplyContactService from "../services/contact/ReplyContactService";
import asyncHandler from "../utils/asyncHandler";
import pickValidFields from "../utils/pickValidFields";

const createContact = asyncHandler(async (req, res) => {
    const result = await CreateContactService(req.body);
    res.status(200).json({
        success: true,
        message: "Your contact information has been submitted successfully.",
        data: result
    })
})

const getContacts = asyncHandler(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, ContactValidFields);
    const result = await GetContactsService(validatedQuery);
    res.status(200).json({
        success: true,
        message: 'Contacts are retrieved successfully',
        meta: result.meta,
        data: result.data,
    })
})

const replyContact = asyncHandler(async (req, res) => {
    const { contactId } = req.params;
    const { replyMessage } = req.body;
    const result = await ReplyContactService(contactId as string, replyMessage);
    res.status(200).json({
        success: true,
        message: 'Reply message sent successfully',
        data: result
    })
})

const deleteContact = asyncHandler(async (req, res) => {
    const { contactId } = req.params;
    const result = await DeleteContactService(contactId as string);
    res.status(200).json({
        success: true,
        message: 'Contact is deleted successfully',
        data: result
    })
})



const ContactController = {
    createContact,
    getContacts,
    replyContact,
    deleteContact
}

export default ContactController;