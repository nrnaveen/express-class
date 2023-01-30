const Flash = require("express-flash");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const { createClient } = require("redis");
let RedisClient = createClient({ legacyMode: true });

class Session {
  constructor(app) {
    RedisClient.connect().catch(console.error);
    app.use(
      session({
        secret: process.env.APP_KEY,
        store: new RedisStore({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          client: RedisClient,
        }),
        proxy: false,
        resave: false,
        saveUninitialized: false,
      })
    );
    app.use(Flash());
  }
}

module.exports = (app) => {
  return new Session(app);
};
