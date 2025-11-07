import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ["candidate", "employer", "admin", "superAdmin"],
    },
    status: {
        type: String,
        enum: ['blocked', 'unblocked'],
        default: 'pending'
    },
    regOtp: {
        type: String,
        required: [true, "otp is required"],
        trim: true,
        maxlength: 6,
        minlength: 6
    },
    regOtpExpires: {
        type: Date,
        default: () => new Date(+new Date() + 600000), // 10 minutes // OTP Code Will be expired within 10 minutes
    },
    forgotOtp: {
        type: String,
        trim: true,
        maxlength: 6,
        minlength: 6
    },
    forgotOtpstatus: {
        type: Number
    },
    forgotOtpExpires: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false
})

const UserModel = model<IUser>('User', userSchema);
export default UserModel;
