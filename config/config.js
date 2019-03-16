var path			= require('path'),
	logger			= require('morgan'),
	favicon 		= require('serve-favicon'),
	cookieParser	= require('cookie-parser');

class Configuration {

	constructor(app, express) {
		app.use(logger('dev'));
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));
		app.use(cookieParser());
		app.use(express.static(path.join(appRoot, 'public')));
	}

};

module.exports = (app, express) => {
	return new Configuration(app, express);
};