import { Application } from "../models/application.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.schema.js";
import { Portal } from "../models/portal.schema.js";

const addApplication = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;  // Corrected userId access
        const { profile, company, jobPortal, applicationLink } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(401, "User not found");
        }
        console.log("jobPortal:",jobPortal)
        const portalExists=await Portal.findOne({name:jobPortal});
        if(!portalExists){
            throw new ApiError(404,"Portal not found")
        }
        
        const application = await Application.create({
            user: userId,
            profile: profile,
            company: company,
            jobPortal: portalExists,
            applicationLink: applicationLink || "",
            status: "Applied"
        });
        
        if (!application) {
            throw new ApiError(404, "Error creating application");
        }
        
        user.applications.push(application);
        await user.save();  // Save user after updating applications
        
        return res.status(201).json(  
            new ApiResponse(201, {application}, "Application created successfully")
        );
        
    } catch (error) {
        throw new ApiError(500, error?.message || "An unexpected error occurred while creating application");
    }
});

export { addApplication };
