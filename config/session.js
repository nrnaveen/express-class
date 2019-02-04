var Flash		= require('express-flash'),
	redis		= require('redis'),
	session		= require('express-session'),
	RedisStore	= require('connect-redis')(session),
	Client		= redis.createClient();

class Session {

	constructor(app) {
		app.use(session({
			secret: secret_key,
			store: new RedisStore({
				host: 'localhost',
				port: 6379,
				client: Client,
			}),
			proxy: false,
			resave: false,
			saveUninitialized: false,
		}));
		app.use(Flash());
	}

};

module.exports = function (app) {
	return new Session(app);
};