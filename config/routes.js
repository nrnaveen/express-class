var indexRouter = require('../routes/index'),
	usersRouter = require('../routes/users');

class Routes {

	constructor(app) {
		app.use('/', indexRouter);
		app.use('/users', usersRouter);
	}

};

module.exports = function (app) {
	return new Routes(app);
};