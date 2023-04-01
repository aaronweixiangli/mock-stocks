const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    symbol: { type: String, required: true },
    type: { type: String, enum: ["stock", "crypto"], required: true },
    status: { type: String, enum: ["active", "inactive"] },
    buyOrSell: { type: String, enum: ["buy", "sell"], required: true },
    orderType: {
      type: String,
      enum: [
        "market order",
        "limit order",
        "stop loss order",
        "stop limit order",
        "trailing stop order",
        "recurring investment",
      ],
      required: true,
    },
    sharesOrDollars: { type: String, enum: ["shares", "dollars"] },
    shares: { type: Number },
    dollars: { type: Number },
    limitPrice: { type: Number },
    expires: { type: String, enum: ["good for day", "good till canceled"] },
    stopPrice: { type: Number },
    trailType: { type: String, enum: ["percentage", "amount"] },
    trailPercent: { type: Number },
    trailAmount: { type: Number },
    starts: { type: Date },
    amount: { type: Number },
    frequency: {
      type: String,
      enum: [
        "every market day",
        "every week",
        "every two weeks",
        "every month",
      ],
    },
    isMarketOpen: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
