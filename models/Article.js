var mongoose 	=	require('mongoose'),
validators 		=	require('mongoose-validators'),
mongoosePaginate=	require('mongoose-paginate'),
findOrCreate 	=	require('mongoose-findorcreate'),
Schema 			=	mongoose.Schema,
ArticleSchema	=	new Schema({
	description: {
		type: String,
		required: true
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
}, {
	collection: 'articles', // table name
	timestamps: true,
	toObject: {
		virtuals: true, // enable virtual fields
	},
	toJSON: {
		virtuals: true, // enable virtual fields
	},
}).plugin(findOrCreate).plugin(mongoosePaginate);

module.exports = mongoose.model('Article', ArticleSchema);