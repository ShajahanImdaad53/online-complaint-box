import User from "@/models/User";
import connectDB from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(request){
   
    try{
        await connectDB();
  const body = await request.json();
  const {username, email,password,nic,address} = body;
  
  if(!username || !email || !password || !nic){
     return NextResponse.json(
        {error:"Please fill all the fields"},
        {status:400}
     );
     }
     
     //check if user already exists
     const exitingUser = await User.findOne({email});
     if(exitingUser){
        return NextResponse.json(
            {message: "User already exists"},
            {status:409}
        );
     }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        //create new user
        const newUser = new User({
            username,
            email,
            password:hashedPassword,
            nic,
            address,
        });

        await newUser.save();

        return NextResponse.json(
            {
                message:"User registered successfully",
                userId: newUser._id,
            },
            {status:201}    
        );

    }
    catch(error){
        console.error("Error registering user:", error);
        return NextResponse.json(
            {error:"Internal server error"},
            {status:500}
        )
    
    }


  
   

}