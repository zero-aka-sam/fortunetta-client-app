import mongoose from "mongoose";
import UserModal from "../models/user.js";

export const signin = async (req, res) => {
  const { walletAddress } = req.body;

  try {
    const oldUser = await UserModal.findOne({ walletAddress });

    if (oldUser) return res.status(201).json({ result: oldUser });

    const createUser = await UserModal.create({ walletAddress });

    res.status(200).json({ result: createUser });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(err);
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { displayName, email, walletAddress, description, selectedFile } =
    req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`Unauthenticated user ${id}`);

    const updatedProfile = {
      displayName,
      email,
      walletAddress,
      description,
      selectedFile,
    };

    const newUpdatedProfile = await UserModal.findByIdAndUpdate(
      id,
      updatedProfile,
      { new: true }
    );

    res.json({ result: newUpdatedProfile });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
