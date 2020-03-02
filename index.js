
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

let middleware = require('./middleware/check-token');
let checkSession = require('./middleware/check-session');

/**
 * init firebase service access
 */
let line = require('./line_modules/line');
// use firebase as back-end db
line.initAuthService('firebase');
line.initDBService('firebase');


/**
 * routes
 */
let routeMain = require('./routes/rt-main');
let routeAuth = require('./routes/rt-auth/rt-auth');
let routeService = require('./routes/rt-service/rt-service');
let routeApi = require('./routes/rt-api/rt-api');

let app = express();
const APPNAME = "line";
const PORT = 65000;
const VERSION = '0.1.0';


// for security purpose
app.use(helmet());

app.use(bodyParser.json());

// register template engine
app.engine('html', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'html');
app.locals.delimiters = '{% %}';

// url access granted
app.use(cookieParser());
console.log("----- ", __dirname);
app.use('/', express.static(path.join(__dirname + '/views/resources')));

// main page
app.get('/', routeMain.main);
app.get('/404', routeMain.noResource);
app.get('/oops', routeMain.error);

// user auth
app.use('/auth', routeAuth.router);

// view service pages
app.use('/service', checkSession.on, routeService.router);

// add RESTFul APIs below
app.use('/api', checkSession.on, routeApi.router);

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