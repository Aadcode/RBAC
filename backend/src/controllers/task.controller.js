import { Task } from "../models/task.model.js";

export const createTask = async (req, res) => {
  const { title, description, priority, assignedTo } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    assignedTo,
    createdBy: req.user._id,
  });

  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  let query = {};

  // If employee, only show assigned tasks
  if (req.user.role === "employee") {
    query.assignedTo = req.user._id;
  }

  const tasks = await Task.find(query)
    .populate("assignedTo", "username email")
    .populate("createdBy", "username email");

  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate("assignedTo", "username", "email");

  res.json(updatedTask);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();
  res.json({ message: "Task removed" });
};
