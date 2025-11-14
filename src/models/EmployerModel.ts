import { Schema, model } from 'mongoose';
import { IEmployer } from '../interfaces/employer.interface';

const employerSchema = new Schema<IEmployer>({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, "userId is required"],
        trim: true,
        unique: true
    },
    fullName: {
        type: String,
        required: [true, "fullName is required"],
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true
    },
    phone: {
        type: String,
        required: [true, "phone is required"],
        trim: true,
        maxlength: 20
    },
    profileImg: {
        type: String,
        default: ""
    },
}, {
    timestamps: true,
    versionKey: false
})

const EmployerModel = model<IEmployer>('Employer', employerSchema);
export default EmployerModel;
