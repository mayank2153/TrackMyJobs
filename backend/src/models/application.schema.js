import mongoose, { Schema } from "mongoose";

const applicationStatuses = ['Applied', 'Interviewing', 'Offered', 'Rejected', 'Accepted'];

const ApplicationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",  
        required: true
    },
    profile: {
        type: String
    },
    company: {
        type: String,
        required: true
    },
    jobPortal: {
        type: Schema.Types.ObjectId,
        ref: "Portal",  
        required: true
    },
    applicationLink: {
        type: String
    },
    status: {
        type: String,
        enum: applicationStatuses,
        default: 'Applied'
    }
}, {
    timestamps: true
});

export const Application = mongoose.model("Application", ApplicationSchema);
