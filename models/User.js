var mongoose 	=	require('mongoose'),
validators 		=	require('mongoose-validators'),
mongoosePaginate=	require('mongoose-paginate'),
findOrCreate 	=	require('mongoose-findorcreate'),
passportLocal 	= 	require('passport-local-mongoose'),
Schema 			=	mongoose.Schema,
UserSchema		=	new Schema({
	email: {
		type: String,
		required: true,
		email: true,
		unique: true,
	},
	password: {
		type: String,
	},
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
}, {
	collection: 'users', // table name
	timestamps: true,
	toObject: {
		virtuals: true, // enable virtual fields
	},
	toJSON: {
		virtuals: true, // enable virtual fields
	},
}).plugin(findOrCreate).plugin(mongoosePaginate).plugin(passportLocal, {
	usernameField: 'email',
	passwordField: 'password',
});

module.exports = mongoose.model('User', UserSchema);