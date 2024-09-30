import mongoose, { Schema } from "mongoose";

const PortalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    applications: [{
        type: Schema.Types.ObjectId,
        ref: "Application"  
    }]
});

export const Portal = mongoose.model("Portal", PortalSchema);
