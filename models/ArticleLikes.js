var mongoose 	=	require('mongoose'),
validators 		=	require('mongoose-validators'),
mongoosePaginate=	require('mongoose-paginate'),
findOrCreate 	=	require('mongoose-findorcreate'),
Schema 			=	mongoose.Schema,
ArticleLikeSchema		=	new Schema({
	article_id: {
		type: Schema.Types.ObjectId,
		ref: "Article",
		required: true
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	type: {
		type: Boolean,
		default: true,
		enum: [true, false],
	},
}, {
	collection: 'article_likes', // table name
	timestamps: true,
	toObject: {
		virtuals: true, // enable virtual fields
	},
	toJSON: {
		virtuals: true, // enable virtual fields
	},
}).plugin(findOrCreate).plugin(mongoosePaginate);

module.exports = mongoose.model('ArticleLike', ArticleLikeSchema);