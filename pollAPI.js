// const { Worker, SHARE_ENV } = require("worker_threads");
const { Worker } = require("worker_threads");

let isPolling = false;
let frequencyInMinutes = 1;

setInterval(function () {
  if (!isPolling) return;
  // check for date and time
  const now = new Date();
  const day = now.getDay();
  // if it's either Sunday or Saturday, return
  if (day === 0 || day === 6) return;
  // if it's not in between 6:30am to 1:00pm PDT, return
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();
  if (hours < 13 || hours > 20) return;
  if (hours === 13 && minutes < 30) return;

  console.log("Starting to poll API at", new Date());

  const worker = new Worker("./worker.js");

  worker.on("message", function (message) {
    console.log(message);
  });

  worker.on("online", function () {
    console.log("Worker thread has started");
  });

}, frequencyInMinutes * 60 * 1000);

module.exports = {
  start: function () {
    isPolling = true;
  },
  stop: function () {
    isPolling = false;
  },
  setFrequencyMinutes: function (mins) {
    frequencyInMinutes = mins;
  },
};
