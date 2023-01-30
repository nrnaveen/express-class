const express = require("express");
const functions = require("../functions");
const article = require("../controllers/ArticleController.js");
const auth = require("../controllers/AuthController.js");
const router = express.Router();

// route to register page
router.get("/register", functions.isNotAuthenticated, auth.register);

// route for register action
router.post("/register", functions.isNotAuthenticated, auth.doRegister);

// route to login page
router.get("/login", functions.isNotAuthenticated, auth.login);

// route for login action
router.post("/login", functions.isNotAuthenticated, auth.doLogin);

// route for logout action
router.get("/logout", functions.isAuthenticated, auth.logout);

// Get all articles
router.get("/", article.list);

// Get single article by id
router.get("/show/:id", functions.isAuthenticated, article.show);

// Create article
router.get("/create", functions.isAuthenticated, article.create);

// Save article
router.post("/save", functions.isAuthenticated, article.save);

// Edit article
router.get("/edit/:id", functions.isAuthenticated, article.edit);

// Edit update
router.post("/update/:id", functions.isAuthenticated, article.update);

// Edit delete
router.post("/delete/:id", functions.isAuthenticated, article.delete);

// Like Article
router.post("/like/:id", functions.isAuthenticated, article.likeArticle);

// Article Comments
router.get("/comments/:id", functions.isAuthenticated, article.comments);

// Post Comment
router.post("/comment/:id", functions.isAuthenticated, article.createComment);

// Like Comment
router.post(
  "/comment/:id/like",
  functions.isAuthenticated,
  article.likeComment
);

// Dislike Comment
router.post(
  "/comment/:id/dislike",
  functions.isAuthenticated,
  article.dislikeComment
);

module.exports = router;
