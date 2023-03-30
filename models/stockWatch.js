const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockWatchSchema = new Schema(
  {
    symbol: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockWatch", stockWatchSchema);
