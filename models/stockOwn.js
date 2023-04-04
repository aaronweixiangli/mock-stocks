const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockOwnSchema = new Schema(
  {
    symbol: { type: String, required: true },
    qty: { type: Number, required: true },
    avgCost: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    sharesOnHold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockOwn", stockOwnSchema);
