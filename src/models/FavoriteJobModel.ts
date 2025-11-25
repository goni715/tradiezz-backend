import { model, Schema } from "mongoose";
import { IFavoriteJob } from "../interfaces/favoriteJob.interface";

const favoriteJobSchema = new Schema<IFavoriteJob>({
    candidateUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    jobId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Job"
    }
}, {
    timestamps: true,
    versionKey: false
}
);


const FavoriteJobModel = model<IFavoriteJob>("FavoriteJob", favoriteJobSchema);
export default FavoriteJobModel;