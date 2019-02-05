var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const server = 'localhost'; // REPLACE WITH YOUR DB SERVER
const database = 'spritle_task'; // REPLACE WITH YOUR DB NAME
class Database {

	constructor() {
		mongoose.connect(`mongodb://${server}/${database}`, { useMongoClient: true }).then(() => {
			console.log('Database connection successful')
		}).catch((err) => {
			console.error('Database connection error')
			console.error(err);
		});
		mongoose.set('debug', true);
	}
};

module.exports = function (app) {
	return new Database;
};