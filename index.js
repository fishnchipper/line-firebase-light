/**
 * App
 */
let bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
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
  databaseURL: "https://*.firebaseio.com",
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
    routeAuth = require('./routes/rt-auth/rt-auth'),
    routeApp = require('./routes/rt-app/rt-app'),
    routeService = require('./routes/rt-service/rt-service');

/**
 * Middlewares
 */
let checkAccessToken = require('./middleware/check-access-token');
let checkSession = require('./middleware/check-session');


let app = express();
const APPNAME = process.env.npm_package_name;
const PORT = process.env.npm_package_config_port;
const VERSION = process.env.npm_package_version;

// log date-time of request
app.use(function (req, res, next) {
  req.requestDateTime = new Date().toISOString();
  next();
});

// for security purpose
app.use(helmet());
app.use(cors());

app.use(bodyParser.json());

// register server-side template engine
app.engine('html', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'html');

// url access granted
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname + '/views/resources')));

// main page
app.get('/', routeMain.main);
app.get('/404', routeMain.noResource);
app.get('/oops', routeMain.error);

// [OTHER METHODS NEED TO BE CONSIDERED] plays like a cache for keeping appProfiles queried by /auth/app
global.___appProfileList___ = new Map(); 
// [OTHER METHODS NEED TO BE CONSIDERED] PKI asyncronous key pairs used for OAuth2.0 access key generation
const lineInit = require('./line_modules/line-init');
lineInit.generateAKeyPairsForAccessKey();

// user & app authentication
app.use('/auth', routeAuth.router);

// app
app.use('/app', checkSession.on, routeApp.router);

// view service pages
// allow access with valid session only
app.use('/service', checkSession.on, routeService.router);


// add your RESTFul APIs here if any
//
    // >> swagger setup
    const swaggerJSDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');
    const swaggerDefinition = {
      openapi: "3.0.0",
      info: {
        title: "line-firebase",
        version: VERSION,
        description:
          "line-firebase is a NodeJS + Express App shell which can be used as ....",
        license: {
          name: "MIT",
          url: "https://github.com/fishnchipper/line-firebase/blob/master/LICENSE"
        },
        contact: {
          name: "GitHub",
          url: "https://github.com/fishnchipper/line-firebase"
        }
      },
      servers: [
        {
          url: "https://localhost:" + PORT + "/api/xxx/v1"
        }
      ]
    };
    const swaggerOptions = {
      swaggerDefinition,
      apis: ['./models/*.js', './routes/*/*.js'],
    };
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    // openapi 3.x docs 
    app.use('/api/docs', checkSession.on, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {customCss: '.swagger-ui .topbar { display: none }'}));


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