import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 1,
        },
        password:{
            type: String,
            required: true,
            minLength:5,
            maxLength: 50,
        },


    },
    {
        timestamps: true
    }
)

//before saving any password must hash

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
         return;
    }
    this.password = await bcrypt.hash(this.password,10);

    
});


//comparing passwords
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
};

export const User = mongoose.model("User",userSchema)