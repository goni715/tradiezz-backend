import { Schema, model } from 'mongoose';
import { PolicyTypeArray } from '../constant/Policy.constant';
import { IPolicy } from '../interfaces/policy.interface';
      
const policySchema = new Schema<IPolicy>({
  type: {
    type: String,
    enum: PolicyTypeArray,
    required: true,
    unique: true,
  },
  content: { 
    type: String,
    required: true,
    trim: true
  }
}, {
    timestamps: true,
    versionKey: false
})
      
const PolicyModel = model<IPolicy>('Policy', policySchema);
export default PolicyModel;
      