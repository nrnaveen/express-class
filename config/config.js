const path = require("path");
const logger = require("morgan");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const i18n = require("i18n");

i18n.configure({
  register: global,
  locales: ["en", "ta"],
  defaultLocale: "en",
  cookie: "locale",
  header: "accept-language",
  queryParameter: "lang",
  extension: ".json",
  api: {
    __: "t", // now req.__ becomes req.t
    __n: "tn", // and req.__n can be called as req.tn
  },
  directory: path.join(appRoot, "locales"),
  updateFiles: false,
});

class Configuration {
  constructor(app, express) {
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(i18n.init);
    app.use(express.static(path.join(appRoot, "public")));
  }
}

module.exports = (app, express) => {
  return new Configuration(app, express);
};
