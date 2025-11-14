import CustomError from "../../errors/CustomError";
import ContactModel from "../../models/ContactModel";
import isObjectId from "../../utils/isObjectId";
import sendReplyEmail from "../../utils/sendReplyEmail";

const ReplyContactService = async (contactId: string, replyMessage: string) => {
  if (!isObjectId(contactId)) {
    throw new CustomError(400, "contactId must be a valid ObjectId")
  }
  const contact = await ContactModel.findById(contactId);
  if (!contact) {
    throw new CustomError(404, "contactId Not Found");
  }

  if(contact.replyMessage){
    throw new CustomError(409, "Reply message already sent.")
  }
 
  //update contact
  const result = await ContactModel.updateOne(
    { _id: contactId },
    { replyMessage, replyAt: new Date(), status: "replied" },
    { runValidators: true }
  );

  //send reply message
  await sendReplyEmail(contact.email, replyMessage);
  return result;
};

export default ReplyContactService;
