var indexRouter = require('../routes/index'),
	usersRouter = require('../routes/users');

class Routes {

	constructor(app) {
		app.use('/', indexRouter);
		app.use('/users', usersRouter);
	}

};

module.exports = (app, express) => {
	return new Routes(app);
};