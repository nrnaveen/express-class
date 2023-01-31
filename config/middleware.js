class MiddleWare {
  constructor(app) {
    app.use((req, res, next) => {
      if (req?.query?.lang) {
        res.cookie("locale", req?.query?.lang, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
        });
      }
      next();
    });
  }
}

module.exports = (app) => {
  return new MiddleWare(app);
};
