import { IPolicy } from "../../interfaces/policy.interface";
import PolicyModel from "../../models/Policy.model";

const CreateUpdatePolicyService = async (payload: IPolicy) => {
  //check policy is already exists
  const policy = await PolicyModel.findOne({ type: payload.type });

  if (policy) {
    const result = await PolicyModel.updateOne(
      { type: payload.type },
      { content: payload.content},
      { runValidators: true }
    );

    //  const res = await fetch("http://localhost:3000/api/revalidate", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //           tag: "policy",
    //           secret: "my-super-secret"
    //         })
    //       });

    //       const result2 = await res.json();
    //       console.log(result2)
    return result;
  }

  const result = await PolicyModel.create(payload);  
  return result;
};

export default CreateUpdatePolicyService;