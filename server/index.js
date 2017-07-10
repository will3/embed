require('dotenv').config()

const express = require('express');
const compression = require('compression');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(compression());
app.use(bodyParser());

app.use(express.static(__dirname + '/public'));

var MongoClient = require('mongodb').MongoClient;
var MONGODB_URI = process.env.MONGODB_URI;

MongoClient.connect(MONGODB_URI, function(err, database) {
  if (err) throw err;

  var db = database;

  var config = { db };

  require('./setupdb')(db);
  require('./controllers/short')(app, config);
  require('./controllers/search')(app, config);

  const port = process.env.PORT || 3001;
  app.listen(port);
  console.log('Express server started on port %s', port);
});
