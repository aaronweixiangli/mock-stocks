const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
// Always require and configure near the top
require('dotenv').config();
// Connect to the database
require('./config/database');

const app = express();

app.use(logger('dev'));
app.use(express.json());

// Configure both serve-favicon & static middleware
// to serve from the production 'build' folder
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

// Middleware to check and verify a JWT and
// assign the user object from the JWT to req.user
app.use(require('./config/checkToken'));

const port = process.env.PORT || 3001;

// Put API routes here, before the "catch all" route
const ensureLoggedIn = require('./config/ensureLoggedIn');
app.use('/api/users', require('./routes/api/users'));
app.use('/api/news', ensureLoggedIn, require('./routes/api/news'));
app.use('/api/stocks', ensureLoggedIn, require('./routes/api/stocks'));

const polling = require('./pollAPI');
polling.start();
app.get('/polling/start', function(req, res) {
  polling.start();
  res.send('Start polling');
})
app.get('/polling/stop', function(req, res) {
  polling.stop();
  res.send('Stop polling');
})
app.get('/polling/frequency/:min', function(req, res) {
  polling.setFrequencyMinutes(parseInt(req.params.min));
  res.send('Change frequency');
})


// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX/API requests
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, function() {
  console.log(`Express app running on port ${port}`);
});
