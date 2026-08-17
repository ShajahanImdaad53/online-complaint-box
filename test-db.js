const fs = require('fs');
const mongoose = require('mongoose');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const MONGO_URI = envVars.MONGO_URI;

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    const userSchema = new mongoose.Schema({ email: String, password: String, role: String }, { strict: false });
    const User = mongoose.models.User || mongoose.model("User", userSchema);

    console.log("Finding user ishan@gmail.com...");
    const user = await User.findOne({ email: "ishan@gmail.com" });
    if (!user) {
      console.log("User not found!");
    } else {
      console.log("User found:", { email: user.email, role: user.role });
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("Error during test:", error);
  }
}

testConnection();
