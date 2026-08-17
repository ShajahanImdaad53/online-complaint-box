const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const MONGO_URI = envVars.MONGO_URI;
const JWT_SECRET = envVars.JWT_SECRET;

async function testLogin() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const userSchema = new mongoose.Schema({ email: String, password: String, role: String }, { strict: false });
    const User = mongoose.models.User || mongoose.model("User", userSchema);

    const user = await User.findOne({ email: "ishan@gmail.com" });
    if (!user) {
      console.log("User not found!");
      return;
    }
    
    console.log("Testing bcrypt.compare...");
    // Just testing if it throws when comparing a wrong password (or right one if they typed something)
    try {
      const isMatch = await bcrypt.compare("123456", user.password);
      console.log("Bcrypt compare result:", isMatch);
    } catch (e) {
      console.error("Bcrypt error:", e);
    }

    console.log("Testing jwt.sign...");
    try {
      const token = jwt.sign(
        {userId : user._id, role: user.role},
        JWT_SECRET,
        {expiresIn: "1d"}
      );
      console.log("JWT generated successfully!");
    } catch(e) {
      console.error("JWT Error:", e);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("Error during test:", error);
  }
}

testLogin();
