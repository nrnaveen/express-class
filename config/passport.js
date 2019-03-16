var passport		= require('passport'),
	LocalStrategy	= require('passport-local').Strategy,
	User			= require('../models/User');

class Passport {

	constructor(app) {
		app.use(passport.initialize());
		app.use(passport.session());
		// passport configuration
		passport.use(User.createStrategy());
		passport.serializeUser((user, done) => {
			done(null, user.id);
		});
		passport.deserializeUser((id, done) => {
			User.findById(id, (err, user) => {
				done(err, user);
			});
		});
	}

};

module.exports = (app) => {
	return new Passport(app);
};