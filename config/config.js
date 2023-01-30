const path = require("path");
const logger = require("morgan");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");

class Configuration {
  constructor(app, express) {
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(appRoot, "public")));
  }
}

module.exports = (app, express) => {
  return new Configuration(app, express);
};
