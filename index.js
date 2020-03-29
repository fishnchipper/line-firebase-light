/**
 * App
 */
let https = require('https'),
    fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    mustacheExpress = require('mustache-express');

/**
 * Firebase service setup
 */
const lineFirebase = require('./line_modules/line-firebase');
const lineFirebaseOptions = {
  // firebase database url
  databaseURL: "https://line-7e593.firebaseio.com",
  // firebase Admin SDK private key 
  keyFilename: './environment/firebase-serverkey.json'
};
lineFirebase.setup(lineFirebaseOptions);
// init for firebase Authentication access
lineFirebase.initAuthService();
// init for firebase Database access
//lineFirebase.initDBService();

/**
 * Routes
 */
let routeMain = require('./routes/rt-main'),
    routeAuth = require('./routes/rt-auth/rt-auth'),
    routeService = require('./routes/rt-service/rt-service');

/**
 * Middlewares
 */
let checkSessionToken = require('./middleware/check-token');
let checkSession = require('./middleware/check-session');


let app = express();
const APPNAME = process.env.npm_package_name;
const PORT = process.env.npm_package_config_port;
const VERSION = process.env.npm_package_version;




// for security purpose
app.use(helmet());

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


// user auth
app.use('/auth', routeAuth.router);

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
    app.use('/api/xxx/v1', checkSessionToken.on, routeApiXXXV1.router);

//
// end of your RESTFul APIs

// end session for other request with erro message return
app.use(routeMain.noResource);


/**
 * run server
 */
https.createServer({
  key: fs.readFileSync(__dirname + '/environment/server.key'),
  cert: fs.readFileSync(__dirname + '/environment/server.cert')
}, app)
.listen(PORT, function () {
  console.log(`==> ${APPNAME} - (v${VERSION}) https://localhost:${PORT}`);
});