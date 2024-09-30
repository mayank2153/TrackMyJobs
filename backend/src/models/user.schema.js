import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    applications: [{
        type: Schema.Types.ObjectId,
        ref: "Application"  
    }],
    registeredPortals: [{
        type: Schema.Types.ObjectId,
        ref: "Portal"  
    }]
}, {
    timestamps: true
});
UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


UserSchema.methods.isPasswordCorrect  = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id:this._id,
            email: this.email

        },
         
        process.env.ACCESS_TOKEN_SECRET, 
        
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        id: this._id,
        email: this.email
    },

    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)}

export const User = mongoose.model("User", UserSchema);
