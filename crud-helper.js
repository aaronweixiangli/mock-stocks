// Connect to the database
require("dotenv").config();
require("./config/database");

// Require the Mongoose models
const User = require("./models/user");
const Order = require("./models/order");
const StockOwn = require("./models/stockOwn");
const History = require("./models/history");
const Notification = require("./models/notification");

// Local variables will come in handy for holding retrieved documents
let user, order;
let users, orders;
