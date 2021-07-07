import mongoose from "mongoose";
const Schema = mongoose.Schema;

const chatSchema = mongoose.Schema(
  {
    message: {
      type: String,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    avatar: {
      type: String,
    },
    userName: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("chat", chatSchema);
