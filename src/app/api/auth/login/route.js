import connectDB from "@/app/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import * as cookie from "cookie";

export async function POST(req){
    
    try {
    await connectDB();
    const body = await req.json();
    const {email,password} = body;

    //validation
    if(!email || !password){
       return NextResponse.json(
        {message: "Email and password required"},
        {status : 400}
       );
    }
 

    //find user
    const user = await User.findOne({email});

    if(!user){
       return NextResponse.json(
        {massage: "Invalid Username or Password"},
        {status: 401 }
       );
    }

    //compare password
    const isMatch = await bcrypt.compare(password,user.password );
    if(!isMatch){
       return NextResponse.json(
        {message: "Invalid Username or Password"},
        {status: 401 }
       );
    }

    //create JWT token
    const token = jwt.sign(
        {userId : user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );


    const response = NextResponse.json({
  message: "Login successful",
});

response.cookies.set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
  sameSite: 'lax', // Use lax instead of strict for better cross-site compatibility
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

return response;


     } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        );
     }

    
}