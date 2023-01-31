const express = require("express");
const path = require("path");
const app = express();

global.appRoot = path.resolve(__dirname);

require("dotenv").config();
require("./config/database")(app);
require("./config/views")(app);
require("./config/config")(app, express);
require("./config/middleware")(app);
require("./config/session")(app);
require("./config/passport")(app);
require("./config/admin")(app);
require("./config/routes")(app, express);
require("./config/errors")(app);

module.exports = app;
