import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import hashedPassword from '../utils/hashedPassword';

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true
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
        enum: ['pending', 'active', 'blocked'],
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



//Hash Password before saving
userSchema.pre("save", async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next(); //this means 
    this.password = await hashedPassword(this.password);
    next();
});


const UserModel = model<IUser>('User', userSchema);
export default UserModel;
