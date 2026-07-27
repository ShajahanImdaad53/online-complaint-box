import { NextResponse } from "next/server";
import * as cookie from "cookie";



export async function POST(){
    try {
        const response = NextResponse.json(
            {message: "Logout successful"},
            {status: 200}
        );

        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Use lax for consistency
            path: "/",
            maxAge: -1,
        });

        return response;



    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        );
    }
}