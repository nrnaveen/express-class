var path = require('path');

class Views {

	constructor(app) {
		// view engine setup
		app.set('views', path.join(appRoot, 'views'));
		app.set('view engine', 'twig');
	}

};

module.exports = function (app) {
	return new Views(app);
};