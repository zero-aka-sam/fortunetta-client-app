import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String },
  walletAddress: { type: String },
  displayName: { type: String },
  description: { type: String },
  selectedFile: { type: String },
});

export default mongoose.model("UsersInfo", userSchema);
