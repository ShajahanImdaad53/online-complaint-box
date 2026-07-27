import mongoose from "mongoose";

const StatusLogSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
       enum: ["pending", "approved", "rejected"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.StatusLog ||
  mongoose.model("StatusLog", StatusLogSchema);