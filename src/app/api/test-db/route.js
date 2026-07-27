const { default: connectDB } = require("@/app/lib/mongodb");
const { NextResponse } = require("next/server");

export async function GET() {
   await connectDB();

   return NextResponse.json(
    {message: "Connected to MongoDB successfully!",}
   );
}