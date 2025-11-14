import { Schema, model } from 'mongoose';
import { IContact } from '../interfaces/contact.interface';

const contactSchema = new Schema<IContact>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address`
        }
    },
    subject: {
        type: String,
        required: [true, "Subject is required"],
        trim: true,
        maxlength: 150,
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        maxlength: 1000,
    },
    replyMessage: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
    },
    replyAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "replied"],
        default: "pending",
    },
}, {
    timestamps: true,
    versionKey: false
})

const ContactModel = model<IContact>('Contact', contactSchema);
export default ContactModel;
