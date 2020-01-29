
/**
 * App
 */
let https = require('https'),
    fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    path = require('path'),
    mustacheExpress = require('mustache-express');

let middleware = require('./middleware/check-token');

/**
 * routes
 */
let routeMain = require('./routes/rt-main');
let routeView = require('./routes/rt-view/rt-view');
let routeApi = require('./routes/rt-api/rt-api');



let app = express()
const APPNAME = "line"
const PORT = 30999
const VERSION = '0.1.0'

// for security purpose
app.use(helmet());

app.use(bodyParser.json());

// register template engine
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.locals.delimiters = '{% %}';

// url access granted
app.use('/', express.static(path.join(__dirname + '/views')));

// main page
app.get('/', routeMain.main);
app.get('/sign-in', routeMain.signIn);
app.post('/login', routeMain.loginHandler);


// view pages
app.use('/service', middleware.checkToken, routeView.router);


// add RESTful APIs below
app.use('/api', middleware.checkToken, routeApi.router);


// end session for other request with erro message return
app.use(routeMain.endSession);


/**
 * run server
 */

https.createServer({
  key: fs.readFileSync(__dirname + '/environment/server.key'),
  cert: fs.readFileSync(__dirname + '/environment/server.cert')
}, app)
.listen(PORT, function () {
  console.log(`==> ${APPNAME} - (v${VERSION}) listening on port ${PORT}!`);
});