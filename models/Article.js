var mongoose 	=	require('mongoose'),
validators 		=	require('mongoose-validators'),
mongoosePaginate=	require('mongoose-paginate'),
findOrCreate 	=	require('mongoose-findorcreate'),
Schema 			=	mongoose.Schema;

class Article extends Schema {

	/**
     * Declare "legs" as a static property of animal with a default value of 4
     */
    // static legs = 4;

	constructor() {
		super({
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
	}

	// naveen(){ console.log("DSFc") }

}

module.exports = mongoose.model('Article', new Article);