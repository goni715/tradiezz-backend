import { PolicyTypeArray } from "../../constant/Policy.constant";
import CustomError from "../../errors/CustomError";
import { TPolicyType } from "../../interfaces/policy.interface";
import PolicyModel from "../../models/Policy.model";

const GetPolicyByTypeService = async (type: TPolicyType) => {
  //check type is not valid
  if (!PolicyTypeArray.includes(type)) {
    throw new CustomError(
      400,
      `Please provide valid Type-- ${PolicyTypeArray.map((type)=> `'${type}'`).join(' or ')} `
    );
  }

  const result = await PolicyModel.findOne({ type }).select("-_id -createdAt");
  if (!result) {
    return {
      type,
      content: ""
    }
  }
  return result;
};

export default GetPolicyByTypeService;
