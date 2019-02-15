var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

class Database {

	constructor() {
		mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`, { useMongoClient: true }).then(() => {
			console.log('Database connection successful')
		}).catch((err) => {
			console.error('Database connection error')
			console.error(err);
		});
		mongoose.set('debug', process.env.APP_DEBUG == 'true');
	}
};

module.exports = function (app) {
	return new Database;
};