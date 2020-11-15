/**
 * App
 */
let bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    fs = require('fs'),
    helmet = require('helmet'),
    mustacheExpress = require('mustache-express'),
    path = require('path');

/**
 * Firebase service setup
 */
if (!fs.existsSync('./environment/firebase-serverkey.json')) {
  console.log("[line-fb:error]./environment/firebase-serverkey.json is not found.\n\n");
  process.exitCode = 1;
  process.exit();
}
const lineFirebase = require('./line_modules/line-firebase');
const lineFirebaseOptions = {
  // firebase database url
  databaseURL: "https://rpki-8f20c.firebaseio.com",
  // firebase Admin SDK private key 
  keyFilename: './environment/firebase-serverkey.json'
};
lineFirebase.setup(lineFirebaseOptions);
// init for firebase Authentication access
lineFirebase.initAuthService();
// init for firebase Database access
lineFirebase.initDBService();


/**
 * Routes
 */
let routeMain = require('./routes/rt-main'),
    routeAuth = require('./routes/rt-auth/rt-auth');

/**
 * Middlewares
 */
let checkAccessToken = require('./middleware/check-access-token');


let app = express();
const APPNAME = process.env.npm_package_name;
const PORT = process.env.npm_package_config_port;
const VERSION = process.env.npm_package_version;



// for security purpose
app.use(helmet());
app.use(bodyParser.json());

// url access granted
app.use(cookieParser());


// [OTHER METHODS NEED TO BE CONSIDERED] plays like a cache for keeping appProfiles queried by /auth/app
global.___appProfileList___ = new Map(); 
// [OTHER METHODS NEED TO BE CONSIDERED] PKI asyncronous key pairs used for OAuth2.0 access key generation
const lineInit = require('./line_modules/line-init');
lineInit.generateAKeyPairsForAccessKey();

// logging
app.use(function (req, res, next) {
  req.requestDateTime = new Date().toISOString();
  console.log('[%s] api call from %s : (%s) %s', req.requestDateTime, req.ip, req.method, req.originalUrl)
  next()
});

// user & app authentication
app.use('/auth', routeAuth.router);

// add your RESTFul APIs here if any
//
    // your defined api
    let routeApiXXXV1 = require('./routes/rt-api-xxx-v1/rt-api-xxx-v1');
    app.use('/api/xxx/v1', checkAccessToken.on, routeApiXXXV1.router);

//
// end of your RESTFul APIs

// end session for other request with erro message return
app.use(routeMain.noResource);


/**
 * run server
 */
app.listen(PORT, function () {
  console.log(`==> ${APPNAME} - (v${VERSION}) http://localhost:${PORT}`);
});