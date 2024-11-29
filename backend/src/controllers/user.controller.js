import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = role;
  await user.save();

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ message: "User removed" });
};
