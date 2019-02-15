var Flash		= require('express-flash'),
	redis		= require('redis'),
	session		= require('express-session'),
	RedisStore	= require('connect-redis')(session),
	Client		= redis.createClient();

class Session {

	constructor(app) {
		app.use(session({
			secret: process.env.APP_KEY,
			store: new RedisStore({
				host: process.env.REDIS_HOST,
				port: process.env.REDIS_PORT,
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