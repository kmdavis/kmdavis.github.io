var
  express = require("express");

function init () {
  console.log("Initializing App");

  var app = express();

  app.configure(function () {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    app.use(express.logger());
    app.use(express.static('.'));
    app.use(app.router);
  });

  app.listen(process.env.PORT, function () {
    console.log('Listening on port %d', process.env.PORT);
  });
}

init();
