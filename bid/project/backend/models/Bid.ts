import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  bidder: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Bid", bidSchema);
