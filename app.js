
// Bring in our dependencies
const
  app        = require('express')(),
  bodyParser = require('body-parser'),
  routes     = require('./routes'),
  mongo      = require('mongodb').MongoClient,
  objectID   = require('mongodb').ObjectID,
  PORT       = 3000,
  mongoUrl   = 'mongodb://localhost:27017/hdfc';

mongo.connect(mongoUrl, { useNewUrlParser: true }, function (err, db) {
  if (err) {
    console.log(err);
  }
  global.mongoClient  = db;
  global.objectID     = objectID;
  global.userDB       = 'users';
});

global.jwtTokenExpiry = 900000;
global.jwtSecretKey = 'mysecretkey';
app.use(bodyParser.json());
//  Connect all our routes to our application
app.use('/', routes);

// Turn on that server!
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
