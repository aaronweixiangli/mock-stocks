const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  text: { type: String, required: true },
  read: { type: Boolean, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Notification", notificationSchema);
