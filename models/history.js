const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new Schema(
  {
    symbol: { type: String, required: true },
    type: { type: String, enum: ["stock", "crypto"], required: true },
    category: {
      type: String,
      enum: ["buy", "sell", "deposit"],
      required: true,
    },
    marketPrice: { type: Number },
    qty: { type: Number },
    deposit: { type: Number },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
