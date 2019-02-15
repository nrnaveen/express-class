var express = require('express'),
    path    = require('path'),
    app     = express();

global.appRoot = path.resolve(__dirname);

require('dotenv').config();
require('./config/database')(app);
require('./config/views')(app);
require('./config/config')(app, express);
require('./config/session')(app);
require('./config/passport')(app);
require('./config/routes')(app, express);
require('./config/errors')(app);

module.exports = app;