import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        nic:{
            type:String,
        },
        profileImage:{
            type:String,
            default:null
        },
        phone:{
            type:String,
            default:null
        },
        address:{
            type:String,
            default:null
        },
        city:{
            type:String,
            default:null
        },
        province:{
            type:String,
            default:null
        },
        postalCode:{
            type:String,
            default:null
        },
        role:{
            type:String,
            enum:["citizen","admin"],
            default:"citizen"
        },
    },
    {timestamps:true}
);

export default mongoose.models.User || mongoose.model("User",userSchema);