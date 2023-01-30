const Validator = require("validatorjs");
const async = require("async");
const { reversePop } = require("../models/reversePop");
const lodash = require("lodash");
const moment = require("moment");
const functions = require("../functions");
const { Article, ArticleLike, Comment, Like } = require("../models");
const { Mail, Transporter } = require("../config/mail")();

class ArticleController {
  constructor() {
    /* Article.schema.naveen();
    console.log(Article.schema.statics);
    console.log(Article.listForUser); */
    /* Transporter.sendMail({
			from: "noreply@nrnaveen.net",
			to: "naveen@asareri.com",
			subject: 'Test',
			template: 'index',
			context: {
				url: 'Config.app.baseUrl',
				resetLink: 'resetPasswordLink',
				name: "Naveen",
			},
		}, (err, info) => {
			console.log(err);
			console.log(info);
		}); */
  }

  // Show list of Articles
  async list(req, res) {
    var page = req.query.page ? req.query.page : 1,
      limit = 10;
    try {
      var articles = await Article.paginate(
        {},
        { populate: "user_id", page: page, limit: limit, sort: { _id: -1 } }
      );
      var opts = {
        modelArray: articles.docs,
        storeWhere: "likes",
        arrayPop: true,
        mongooseModel: ArticleLike,
        idField: "article_id",
        filters: { type: true },
      };
      var articleLikes = await Article.reversePop(opts);
      var opts = {
        modelArray: articleLikes,
        storeWhere: "comments",
        arrayPop: true,
        mongooseModel: Comment,
        idField: "article_id",
      };
      var popArticles = await Article.reversePop(opts);
      var pages = functions.getArrayPages(req)(10, articles.pages, page);
      res.status(200).render("articles/index", {
        functions: functions,
        String: String,
        articles: popArticles,
        pages: pages,
        currentPage: page,
        total: articles.total,
        user: req.user,
      });
    } catch (e) {
      functions.flashError(req, res, e);
      res.render("error", { user: req.user });
    }
  }

  async list2(req, res) {
    var page = req.query.page ? req.query.page : 1,
      limit = 10;
    async.waterfall(
      [
        (callback) => {
          Article.paginate(
            {},
            {
              populate: "user_id",
              page: page,
              limit: limit,
              sort: { _id: -1 },
            },
            callback
          );
        },
        (articles, callback) => {
          var opts = {
            modelArray: articles.docs,
            storeWhere: "likes",
            arrayPop: true,
            mongooseModel: ArticleLike,
            idField: "article_id",
            filters: { type: true },
          };
          reversePop(opts)
            .then((popArticles) => {
              callback(null, articles, popArticles);
            })
            .catch(callback);
        },
        (articles, articleLikes, callback) => {
          var opts = {
            modelArray: articleLikes,
            storeWhere: "comments",
            arrayPop: true,
            mongooseModel: Comment,
            idField: "article_id",
          };
          reversePop(opts)
            .then((popArticles) => {
              callback(null, articles, articleLikes, popArticles);
            })
            .catch(callback);
        },
      ],
      (err, articles, articleLikes, popArticles) => {
        if (err) {
          functions.flashError(req, res, err);
          res.render("error", { user: req.user });
        } else {
          var pages = functions.getArrayPages(req)(10, articles.pages, page);
          res.status(200).render("articles/index", {
            functions: functions,
            String: String,
            articles: popArticles,
            pages: pages,
            currentPage: page,
            total: articles.total,
            user: req.user,
          });
        }
      }
    );
  }

  async list1(req, res) {
    var page = req.query.page ? req.query.page : 1,
      limit = 10;
    async.waterfall(
      [
        (callback) => {
          Article.paginate(
            {},
            {
              populate: "user_id",
              page: page,
              limit: limit,
              sort: { _id: -1 },
            },
            callback
          );
        },
        (articles, callback) => {
          var opts = {
            modelArray: articles.docs,
            storeWhere: "likes",
            arrayPop: true,
            mongooseModel: ArticleLike,
            idField: "article_id",
            filters: { type: true },
          };
          reversePop(opts, (err, popArticles) => {
            callback(err, articles, popArticles);
          });
        },
        (articles, articleLikes, callback) => {
          var opts = {
            modelArray: articleLikes,
            storeWhere: "comments",
            arrayPop: true,
            mongooseModel: Comment,
            idField: "article_id",
          };
          reversePop(opts, (err, popArticles) => {
            callback(err, articles, articleLikes, popArticles);
          });
        },
      ],
      (err, articles, articleLikes, popArticles) => {
        if (err) {
          functions.flashError(req, res, err);
          res.render("error", { user: req.user });
        } else {
          var pages = functions.getArrayPages(req)(10, articles.pages, page);
          res.status(200).render("articles/index", {
            functions: functions,
            String: String,
            articles: popArticles,
            pages: pages,
            currentPage: page,
            total: articles.total,
            user: req.user,
          });
        }
      }
    );
  }

  // Show Article by id
  async show(req, res) {
    try {
      var article = await Article.findOne({ _id: req.params.id });
    } catch (e) {
      functions.flashError(req, res, e);
      res.render("error", { user: req.user });
    }
    // Article.findOne({ _id: req.params.id }).exec((err, article) => {
    // 	if(err){
    // 		functions.flashError(req, res, err);
    // 		res.render('error', { user: req.user, });
    // 	}else if(article){
    // 		res.render("articles/show", { article: article, user: req.user, });
    // 	}else{
    // 		req.flash("error", 'Article not found.');
    // 		res.redirect("/");
    // 	}
    // });
  }

  // Create new Article
  async create(req, res) {
    res.render("articles/create", { user: req.user });
  }

  // Save new Article
  async save(req, res) {
    var data = req.body,
      rules = { description: "required" },
      validation = new Validator(data, rules);
    if (validation.fails()) {
      var errors = validation.errors.all();
      req.flash("error", errors[Object.keys(errors)[0]][0]);
      res
        .status(400)
        .render("articles/create", { article: data, user: req.user });
    } else {
      data.user_id = req.user._id;
      var article = new Article(data);
      article.save((err) => {
        if (err) {
          functions.flashError(req, res, err);
          res.render("articles/create", { user: req.user });
        } else {
          req.flash("success", "Successfully created an article.");
          // res.redirect("/show/" + article._id);
          res.redirect("/");
        }
      });
    }
  }

  // Edit an Article
  async edit(req, res) {
    try {
      var article = await Article.findOne({ _id: req.params.id });
      if (!article) {
        req.flash("error", "Article not found.");
        return res.redirect("/");
      }
      return res.render("articles/edit", { article: article, user: req.user });
    } catch (e) {
      functions.flashError(req, res, e);
      return res.render("error", { user: req.user });
    }
  }

  // Update an Article
  async update(req, res) {
    var data = req.body,
      rules = { description: "required" },
      validation = new Validator(data, rules);
    if (validation.fails()) {
      var errors = validation.errors.all();
      req.flash("error", errors[Object.keys(errors)[0]][0]);
      res
        .status(400)
        .render("articles/edit", { article: data, user: req.user });
    } else {
      Article.findByIdAndUpdate(
        req.params.id,
        {
          $set: { description: req.body.description },
        },
        { new: true },
        (err, article) => {
          if (err) {
            functions.flashError(req, res, err);
            res.render("articles/edit", { article: req.body, user: req.user });
          }
          req.flash("success", "Successfully updated an article.");
          // res.redirect("/show/" + article._id);
          res.redirect("/");
        }
      );
    }
  }

  // Like Article
  async likeArticle(req, res) {
    var data = req.body,
      rules = {
        article_id: "required",
        user_id: "required",
      },
      validation = new Validator(data, rules);
    if (validation.fails()) {
      var errors = validation.errors.all();
      req.flash("error", errors[Object.keys(errors)[0]][0]);
      if (data.hasOwnProperty("article_id")) {
        res.redirect("/like/" + data.article_id);
      } else {
        res.redirect("/");
      }
    } else {
      Article.findOne({ _id: req.params.id }).exec((err, comment) => {
        if (err) {
          functions.flashError(req, res, err);
          res.render("error", { user: req.user });
        } else if (comment) {
          ArticleLike.findOrCreate(
            { article_id: data.article_id, user_id: req.user._id },
            { article_id: data.article_id, user_id: req.user._id },
            (err, like) => {
              if (err) {
                functions.flashError(req, res, err);
                res.redirect("/");
              } else {
                req.flash("success", "Article liked Successfully.");
                res.redirect("/");
              }
            }
          );
        } else {
          req.flash("error", "Article not found.");
          res.redirect("/");
        }
      });
    }
  }

  // Delete an Article
  async delete(req, res) {
    Article.remove({ _id: req.params.id, user_id: req.user._id }, (err) => {
      if (err) {
        functions.flashError(req, res, err);
        res.render("error", { user: req.user });
      } else {
        req.flash("success", "Successfully deleted an article.");
        res.redirect("/");
      }
    });
  }

  // Show Article Comments
  async comments(req, res) {
    async.waterfall(
      [
        (callback) => {
          Article.findOne({ _id: req.params.id }).exec(callback);
        },
        (article, callback) => {
          if (article) {
            Comment.find({ article_id: article._id })
              .populate("user_id")
              .exec((err, comments) => {
                callback(err, article, comments);
              });
          } else {
            callback({ error: "Article Not Found" });
          }
        },
        (article, comments, callback) => {
          var opts = {
            modelArray: comments,
            storeWhere: "likes",
            arrayPop: true,
            mongooseModel: Like,
            idField: "comment_id",
            filters: { type: true },
          };
          reversePop(opts, (err, popComments) => {
            callback(err, article, comments, popComments);
          });
        },
        (article, comments, likes, callback) => {
          var opts = {
            modelArray: likes,
            storeWhere: "dislikes",
            arrayPop: true,
            mongooseModel: Like,
            idField: "comment_id",
            filters: { type: false },
          };
          reversePop(opts, (err, popComments) => {
            callback(err, article, comments, likes, popComments);
          });
        },
      ],
      (err, article, comments, likes, dislikes) => {
        if (err) {
          functions.flashError(req, res, err);
          res.render("error", { user: req.user });
        } else {
          res.render("articles/comments", {
            comments: dislikes,
            article: article,
            user: req.user,
            functions: functions,
          });
        }
      }
    );
  }

  // Save new Article Comment
  async createComment(req, res) {
    var data = req.body,
      rules = {
        comment: "required",
        article_id: "required",
        user_id: "required",
      },
      validation = new Validator(data, rules);
    if (validation.fails()) {
      var errors = validation.errors.all();
      req.flash("error", errors[Object.keys(errors)[0]][0]);
      if (data.hasOwnProperty("article_id")) {
        res.redirect("/comments/" + data.article_id);
      } else {
        res.redirect("/");
      }
    } else {
      Article.findOne({ _id: req.params.id }).exec((err, article) => {
        if (err) {
          functions.flashError(req, res, err);
          res.render("error", { user: req.user });
        } else if (article) {
          var comment = new Comment(data);
          comment.save((err) => {
            if (err) {
              functions.flashError(req, res, err);
              res.redirect("/comments/" + data.article_id);
            } else {
              req.flash("success", "Successfully created an article comment.");
              res.redirect("/comments/" + data.article_id);
            }
          });
        } else {
          req.flash("error", "Article not found.");
          res.redirect("/");
        }
      });
    }
  }

  // Like Comment
  async likeComment(req, res) {
    var data = req.body,
      rules = {
        article_id: "required",
        comment_id: "required",
        user_id: "required",
        type: "required|in:0,1",
      },
      validation = new Validator(data, rules);
    if (validation.fails()) {
      var errors = validation.errors.all();
      req.flash("error", errors[Object.keys(errors)[0]][0]);
      if (data.hasOwnProperty("article_id")) {
        res.redirect("/comments/" + data.article_id);
      } else {
        res.redirect("/");
      }
    } else {
      Comment.findOne({ _id: req.params.id }).exec((err, comment) => {
        if (err) {
          functions.flashError(req, res, err);
          res.render("error", { user: req.user });
        } else if (comment) {
          Like.findOrCreate(
            {
              comment_id: data.comment_id,
              user_id: req.user._id,
              type: data.type,
            },
            {
              comment_id: data.comment_id,
              user_id: req.user._id,
              type: data.type,
            },
            (err, like) => {
              if (err) {
                functions.flashError(req, res, err);
                res.redirect("/comments/" + data.article_id);
              } else {
                req.flash("success", "Comment liked Successfully.");
                res.redirect("/comments/" + data.article_id);
              }
            }
          );
        } else {
          req.flash("error", "Comment not found.");
          res.redirect("/");
        }
      });
    }
  }

  // Dislike Comment
  async dislikeComment(req, res) {
    var data = req.body,
      rules = {
        article_id: "required",
        comment_id: "required",
        user_id: "required",
        type: "required|in:0,1",
      },
      validation = new Validator(data, rules);
    if (validation.fails()) {
      var errors = validation.errors.all();
      req.flash("error", errors[Object.keys(errors)[0]][0]);
      if (data.hasOwnProperty("article_id")) {
        res.redirect("/comments/" + data.article_id);
      } else {
        res.redirect("/");
      }
    } else {
      Comment.findOne({ _id: req.params.id }).exec((err, comment) => {
        if (err) {
          functions.flashError(req, res, err);
          res.render("error", { user: req.user });
        } else if (comment) {
          Like.findOrCreate(
            {
              comment_id: data.comment_id,
              user_id: req.user._id,
              type: data.type,
            },
            {
              comment_id: data.comment_id,
              user_id: req.user._id,
              type: data.type,
            },
            (err, dislike) => {
              if (err) {
                functions.flashError(req, res, err);
                res.redirect("/comments/" + data.article_id);
              } else {
                req.flash("success", "Comment disliked Successfully.");
                res.redirect("/comments/" + data.article_id);
              }
            }
          );
        } else {
          req.flash("error", "Comment not found.");
          res.redirect("/");
        }
      });
    }
  }
}

module.exports = new ArticleController();
