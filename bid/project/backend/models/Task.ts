import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
  status: { type: String, default: "open" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Task", taskSchema);
