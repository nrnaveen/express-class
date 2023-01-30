const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const mongoose = require("mongoose");
const AdminJSMongoose = require("@adminjs/mongoose");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const { createClient } = require("redis");
let RedisClient = createClient({ legacyMode: true });

const { Article, ArticleLike, Comment, Like, User } = require("../models");

// const componentLoader = new AdminJS.ComponentLoader();
// const Components = {
//   Dashboard: componentLoader.add("Dashboard", "dashboard"),
// };

const DEFAULT_ADMIN = {
  email: "admin@example.com",
  password: "password",
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

class Admin {
  constructor(app) {
    AdminJS.registerAdapter({
      Resource: AdminJSMongoose.Resource,
      Database: AdminJSMongoose.Database,
    });
    const adminOptions = {
      // We pass Category to `resources`
      resources: [
        {
          resource: Article,
          options: {
            id: "articles",
            navigation: { name: "Naveen" },
          },
        },
        {
          resource: ArticleLike,
          options: {
            id: "article_likes",
            navigation: { name: "Naveen" },
          },
        },
        {
          resource: Comment,
          options: {
            id: "comments",
            navigation: { name: "Naveen" },
          },
        },
        {
          resource: Like,
          options: {
            id: "likes",
            navigation: { name: "Naveen" },
          },
        },
        {
          resource: User,
          options: {
            id: "users",
            navigation: { name: "Naveen" },
            listProperties: [
              "email",
              "firstname",
              "lastname",
              "createdAt",
              "updatedAt",
            ],
            showProperties: [
              "email",
              "firstname",
              "lastname",
              "createdAt",
              "updatedAt",
            ],
            editProperties: [
              "email",
              "firstname",
              "lastname",
              "password",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
      branding: {
        companyName: "Naveen Admin",
        // logo: "/images/logo.svg",
        withMadeWithLove: false,
      },
      dashboard: {
        handler: async (request, response, context) => {
          console.log("Naveen");
          // return request.redirect("/admin/resources/users");
          const { record, currentAdmin } = context;
          return {
            record: record.toJSON(currentAdmin),
            msg: "Hello world",
          };
        },
      },
      // version: {
      //   admin: true,
      // }
    };
    const admin = new AdminJS(adminOptions);
    const adminRouter = AdminJSExpress.buildRouter(admin);

    // const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    //   admin,
    //   {
    //     authenticate,
    //     cookieName: "adminjs",
    //     cookiePassword: "sessionsecret",
    //   },
    //   null,
    //   {
    //     store: new RedisStore({
    //       host: process.env.REDIS_HOST,
    //       port: process.env.REDIS_PORT,
    //       client: RedisClient,
    //     }),
    //     resave: true,
    //     saveUninitialized: true,
    //     secret: "sessionsecret",
    //     cookie: {
    //       httpOnly: process.env.NODE_ENV === "production",
    //       secure: process.env.NODE_ENV === "production",
    //     },
    //     name: "adminjs",
    //   }
    // );

    app.use(admin.options.rootPath, adminRouter);

    console.log(
      `AdminJS started on http://localhost:${process.env.PORT}${admin.options.rootPath}`
    );
  }
}

module.exports = (app) => {
  return new Admin(app);
};
