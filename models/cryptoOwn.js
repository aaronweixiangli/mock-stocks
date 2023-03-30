const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cryptoOwnSchema = new Schema(
  {
    symbol: { type: String, required: true },
    qty: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CryptoOwn", cryptoOwnSchema);
