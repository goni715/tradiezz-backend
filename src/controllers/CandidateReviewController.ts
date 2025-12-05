import asyncHandler from "../utils/asyncHandler";
import PostEmployerReviewService from "../services/employerReview/PostEmployerReviewService";


const postReview = asyncHandler(async (req, res) => {
    const { userId: candidateUserId } = req.headers;
    const result = await PostEmployerReviewService(candidateUserId as string, req.body);
    res.status(200).json({
        success: true,
        message: "Review is posted successfully",
        data: result
    })
})


const CandidateReviewController = {
    postReview
}

export default CandidateReviewController;