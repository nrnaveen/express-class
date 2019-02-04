var express = require('express'),
	path	= require('path'),
	app		= express();

global.appRoot = path.resolve(__dirname);
global.secret_key	= 'Expressr7+^!-xf)i1agch=^g_0%svl++wjo=z3x!gn%nq7+5mv7m_3h^F22lab';

require('./config/database')(app);
require('./config/views')(app);
require('./config/config')(app, express);
require('./config/session')(app);
require('./config/passport')(app);
require('./config/routes')(app);
require('./config/errors')(app);

module.exports = app;