var Validator	= require('validatorjs'),
	async		= require("async"),
	reversePop	= require('mongoose-reverse-populate'),
	moment		= require("moment"),
	functions	= require("../functions"),
	Article		= require("../models/Article"),
	ArticleLike	= require("../models/ArticleLikes"),
	Comment		= require("../models/Comments"),
	Like		= require("../models/Likes");

class ArticleController {

	constructor(){
		// Article.schema.naveen();
	}

	// Show list of Articles
	list(req, res){
		var page = req.query.page ? req.query.page : 1, limit = 10;
		async.waterfall([
			function(callback){ Article.paginate({}, { populate: 'user_id', page: page, limit: limit, sort: { _id: -1 }, }, callback); },
			function(articles, callback){
				var opts = { modelArray: articles.docs, storeWhere: "likes", arrayPop: true, mongooseModel: ArticleLike, idField: "article_id", filters: { type: true, } };
				reversePop(opts, function(err, popArticles){ callback(err, articles, popArticles); });
			},
			function(articles, articleLikes, callback){
				var opts = { modelArray: articleLikes, storeWhere: "comments", arrayPop: true, mongooseModel: Comment, idField: "article_id" };
				reversePop(opts, function(err, popArticles){ callback(err, articles, articleLikes, popArticles); });
			},
		], function(err, articles, articleLikes, popArticles){
			if(err){
				functions.flashError(req, res, err);
				res.render('error', { user: req.user, });
			}else{
				var pages = functions.getArrayPages(req)(10, articles.pages, page);
				res.status(200).render('articles/index', {
					functions: functions,
					String: String,
					articles: popArticles,
					pages: pages,
					currentPage: page,
					total: articles.total,
					user: req.user,
				});
			}
		});
	}

	// Show Article by id
	show(req, res){
		Article.findOne({ _id: req.params.id }).exec(function(err, article){
			if(err){
				functions.flashError(req, res, err);
				res.render('error', { user: req.user, });
			}else if(article){
				res.render("articles/show", { article: article, user: req.user, });
			}else{
				req.flash("error", 'Article not found.');
				res.redirect("/");
			}
		});
	}

	// Create new Article
	create(req, res){
		res.render("articles/create", { user: req.user, });
	}

	// Save new Article
	save(req, res){
		var data = req.body, rules = { description: "required", },
		validation = new Validator(data, rules);
		if(validation.fails()){
			var errors = validation.errors.all();
			req.flash("error", errors[Object.keys(errors)[0]][0]);
			res.status(400).render('articles/create', { article: data, user: req.user, });
		}else{
			data.user_id = req.user._id;
			var article = new Article(data);
			article.save(function(err){
				if(err){
					functions.flashError(req, res, err);
					res.render("articles/create", { user: req.user, });
				}else{
					req.flash("success", 'Successfully created an article.');
					// res.redirect("/show/" + article._id);
					res.redirect("/");
				}
			});
		}
	}

	// Edit an Article
	edit(req, res){
		Article.findOne({ _id: req.params.id }).exec(function(err, article){
			if(err){
				functions.flashError(req, res, err);
				res.render('error', { user: req.user, });
			}else if(article){
				res.render("articles/edit", { article: article, user: req.user, });
			}else{
				req.flash("error", 'Article not found.');
				res.redirect("/");
			}
		});
	}

	// Update an Article
	update(req, res){
		var data = req.body, rules = { description: "required", },
		validation = new Validator(data, rules);
		if(validation.fails()){
			var errors = validation.errors.all();
			req.flash("error", errors[Object.keys(errors)[0]][0]);
			res.status(400).render('articles/edit', { article: data, user: req.user, });
		}else{
			Article.findByIdAndUpdate(req.params.id, {
				$set: { description: req.body.description, }
			}, { new: true }, function(err, article){
				if(err){
					functions.flashError(req, res, err);
					res.render("articles/edit", { article: req.body, user : req.user, });
				}
				req.flash("success", 'Successfully updated an article.');
				// res.redirect("/show/" + article._id);
				res.redirect("/");
			});
		}
	}

	// Like Article
	likeArticle(req, res){
		var data = req.body, rules = {
			article_id: "required",
			user_id: "required",
		}, validation = new Validator(data, rules);
		if(validation.fails()){
			var errors = validation.errors.all();
			req.flash("error", errors[Object.keys(errors)[0]][0]);
			if(data.hasOwnProperty("article_id")){
				res.redirect('/like/' + data.article_id);
			}else{
				res.redirect('/');
			}
		}else{
			Article.findOne({ _id: req.params.id }).exec(function(err, comment){
				if(err){
					functions.flashError(req, res, err);
					res.render('error', { user: req.user, });
				}else if(comment){
					ArticleLike.findOrCreate({ article_id: data.article_id, user_id: req.user._id, }, { article_id: data.article_id, user_id: req.user._id, }, function(err, like){
						if(err){
							functions.flashError(req, res, err);
							res.redirect('/');
						}else{
							req.flash("success", 'Article liked Successfully.');
							res.redirect('/');
						}
					});
				}else{
					req.flash("error", 'Article not found.');
					res.redirect("/");
				}
			});
		}
	}

	// Delete an Article
	delete(req, res){
		Article.remove({ _id: req.params.id, user_id: req.user._id, }, function(err){
			if(err){
				functions.flashError(req, res, err);
				res.render('error', { user : req.user, });
			}else{
				req.flash("success", 'Successfully deleted an article.');
				res.redirect("/");
			}
		});
	}

	// Show Article Comments
	comments(req, res){
		async.waterfall([
			function(callback){ Article.findOne({ _id: req.params.id, }).exec(callback); },
			function(article, callback){
				if(article){
					Comment.find({ article_id: article._id }).populate('user_id').exec(function(err, comments){ callback(err, article, comments); });
				}else{ callback({ error: "Article Not Found", }); }
			},
			function(article, comments, callback){
				var opts = { modelArray: comments, storeWhere: "likes", arrayPop: true, mongooseModel: Like, idField: "comment_id", filters: { type: true, } };
				reversePop(opts, function(err, popComments){ callback(err, article, comments, popComments); });
			},
			function(article, comments, likes, callback){
				var opts = { modelArray: likes, storeWhere: "dislikes", arrayPop: true, mongooseModel: Like, idField: "comment_id", filters: { type: false, }  };
				reversePop(opts, function(err, popComments){ callback(err, article, comments, likes, popComments); });
			}
		], function(err, article, comments, likes, dislikes){
			if(err){
				functions.flashError(req, res, err);
				res.render('error', { user: req.user, });
			}else{
				res.render("articles/comments", {
					comments: dislikes,
					article: article,
					user: req.user,
					functions: functions,
				});
			}
		});
	}

	// Save new Article Comment
	createComment(req, res){
		var data = req.body, rules = {
			comment: "required",
			article_id: "required",
			user_id: "required",
		}, validation = new Validator(data, rules);
		if(validation.fails()){
			var errors = validation.errors.all();
			req.flash("error", errors[Object.keys(errors)[0]][0]);
			if(data.hasOwnProperty("article_id")){
				res.redirect('/comments/' + data.article_id);
			}else{
				res.redirect('/');
			}
		}else{
			Article.findOne({ _id: req.params.id }).exec(function(err, article){
				if(err){
					functions.flashError(req, res, err);
					res.render('error', { user: req.user, });
				}else if(article){
					var comment = new Comment(data);
					comment.save(function(err){
						if(err){
							functions.flashError(req, res, err);
							res.redirect('/comments/' + data.article_id);
						}else{
							req.flash("success", 'Successfully created an article comment.');
							res.redirect('/comments/' + data.article_id);
						}
					});
				}else{
					req.flash("error", 'Article not found.');
					res.redirect("/");
				}
			});
		}
	}

	// Like Comment
	likeComment(req, res){
		var data = req.body, rules = {
			article_id: "required",
			comment_id: "required",
			user_id: "required",
			type: "required|in:0,1",
		}, validation = new Validator(data, rules);
		if(validation.fails()){
			var errors = validation.errors.all();
			req.flash("error", errors[Object.keys(errors)[0]][0]);
			if(data.hasOwnProperty("article_id")){
				res.redirect('/comments/' + data.article_id);
			}else{
				res.redirect('/');
			}
		}else{
			Comment.findOne({ _id: req.params.id }).exec(function(err, comment){
				if(err){
					functions.flashError(req, res, err);
					res.render('error', { user: req.user, });
				}else if(comment){
					Like.findOrCreate({ comment_id: data.comment_id, user_id: req.user._id, type: data.type, }, { comment_id: data.comment_id, user_id: req.user._id, type: data.type, }, function(err, like){
						if(err){
							functions.flashError(req, res, err);
							res.redirect('/comments/' + data.article_id);
						}else{
							req.flash("success", 'Comment liked Successfully.');
							res.redirect('/comments/' + data.article_id);
						}
					});
				}else{
					req.flash("error", 'Comment not found.');
					res.redirect("/");
				}
			});
		}
	}

	// Dislike Comment
	dislikeComment(req, res){
		var data = req.body, rules = {
			article_id: "required",
			comment_id: "required",
			user_id: "required",
			type: "required|in:0,1",
		}, validation = new Validator(data, rules);
		if(validation.fails()){
			var errors = validation.errors.all();
			req.flash("error", errors[Object.keys(errors)[0]][0]);
			if(data.hasOwnProperty("article_id")){
				res.redirect('/comments/' + data.article_id);
			}else{
				res.redirect('/');
			}
		}else{
			Comment.findOne({ _id: req.params.id }).exec(function(err, comment){
				if(err){
					functions.flashError(req, res, err);
					res.render('error', { user: req.user, });
				}else if(comment){
					Like.findOrCreate({ comment_id: data.comment_id, user_id: req.user._id, type: data.type, }, { comment_id: data.comment_id, user_id: req.user._id, type: data.type, }, function(err, dislike){
						if(err){
							functions.flashError(req, res, err);
							res.redirect('/comments/' + data.article_id);
						}else{
							req.flash("success", 'Comment disliked Successfully.');
							res.redirect('/comments/' + data.article_id);
						}
					});
				}else{
					req.flash("error", 'Comment not found.');
					res.redirect("/");
				}
			});
		}
	}
}

module.exports = new ArticleController;