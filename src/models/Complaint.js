import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    address: {
        type: String,
    },

    location: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },

    images: [
  {
    type: String,
  },
],

},
{
    timestamps: true,
}
);

export default mongoose.models.Complaint ||
mongoose.model("Complaint", complaintSchema);