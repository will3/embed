const express = require('express');
const compression = require('compression');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(compression());
app.use(bodyParser());

require('./controllers/short')(app);
require('./controllers/search')(app);

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3001;
app.listen(port);
console.log('Express server started on port %s', port);
