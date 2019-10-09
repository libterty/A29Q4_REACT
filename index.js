const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortenUrl', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

require('./models');

const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-type,Accept,x-access-token,X-Key'
  );
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

require('./routes/route')(app);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

require('./services');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port`, PORT);
});
