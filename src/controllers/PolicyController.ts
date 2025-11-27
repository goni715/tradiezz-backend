import { TPolicyType } from '../interfaces/policy.interface';
import CreateUpdatePolicyService from '../services/policy/CreateUpdatePolicyService';
import GetPolicyByTypeService from '../services/policy/GetPolicyByTypeService';
import asyncHandler from '../utils/asyncHandler';

const createUpdatePolicy = asyncHandler(async (req, res) => {
  const result = await CreateUpdatePolicyService(req.body);

  res.status(200).json({
    success: true,
    message: 'Policy is updated successfully',
    data: result,
  });
});




const getPolicyByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const result = await GetPolicyByTypeService(type as TPolicyType);

  res.status(200).json({
    success: true,
    message: 'Policy is retrieved successfully',
    data: result,
  });
});




const PolicyController = {
  createUpdatePolicy,
  getPolicyByType,
};
export default PolicyController;
