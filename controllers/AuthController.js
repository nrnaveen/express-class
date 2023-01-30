const passport = require("passport");
const Validator = require("validatorjs");
const functions = require("../functions");
const loadsh = require("lodash");
const { Article, User } = require("../models");

class AuthController {
  constructor() {}

  // Restrict access to root page
  home(req, res) {
    return res.render("index", { user: req.user });
  }

  // Go to registration page
  register(req, res) {
    return res.render("register");
  }

  // Post registration
  doRegister(req, res) {
    var data = req.body,
      rules = {
        firstname: "required|min:3",
        lastname: "required|min:1",
        email: "required|email",
        password: "required|min:5",
      },
      validation = new Validator(data, rules);
    if (validation.fails()) {
      var errors = validation.errors.all();
      req.flash("error", errors[Object.keys(errors)[0]][0]);
      return res.status(400).render("register", { data: data, user: req.user });
    } else {
      var user = new User({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      });
      User.register(user, req.body.password, (err, user) => {
        if (err) {
          functions.flashError(req, res, err);
          return res.render("register", { data: data, user: user });
        }
        passport.authenticate("local", {
          failureFlash: true,
          failureRedirect: "/register",
        })(req, res, () => {
          req.flash("success", "Registered Successfully.");
          return res.redirect("/");
        });
      });
    }
  }

  // Go to login page
  login(req, res) {
    return res.render("login");
  }

  // Post login
  doLogin(req, res, next) {
    var data = req.body,
      rules = {
        email: "required|email",
        password: "required|min:5",
      },
      validation = new Validator(data, rules);
    if (validation.fails()) {
      var errors = validation.errors.all();
      req.flash("error", errors[Object.keys(errors)[0]][0]);
      return res.status(400).render("login", { data: data, user: req.user });
    } else {
      passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
      })(req, res, () => {
        req.flash("success", "Logged In Successfully.");
        return res.redirect("/");
      });
    }
  }

  // logout
  logout(req, res) {
    req.logout();
    req.flash("success", "Logged Out Successfully.");
    return res.redirect("/");
  }
}

module.exports = new AuthController();
