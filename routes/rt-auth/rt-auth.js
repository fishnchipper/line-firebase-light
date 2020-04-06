

let express = require('express');
let router = express.Router();


let checkSessionForAuth = require('../../middleware/check-session-forauth');
let getSignIn = require('./get-signin');
let getSignUp = require('./get-signup');
let putSignUp = require('./put-signup');
let putSignIn = require('./put-signin');
let deleteSignOut = require('./delete-signout');
let getApiAppsList = require('./get-api-apps');
let postApiAppsCreate = require('./post-api-apps');
let deleteApiApps = require('./delete-api-apps');
let getApiAccessToken = require('./get-api-access');
let deleteApiAccessToken = require('./delete-api-access');

/**
 * /auth/signin
 */
router.route('/signin')
      .get(checkSessionForAuth.on, getSignIn.on)
      .put(putSignIn.on);

/**
 * /auth/signup
 */
router.route('/signup')
      .get(checkSessionForAuth.on, getSignUp.on)
      .put(putSignUp.on);

/**
 * /auth/signout
 */
router.route('/signout')
      .delete(deleteSignOut.on);

/**
 * /auth/api/apps
 */
router.route('/api/apps')
      .get(getApiAppsList.on)
      .post(postApiAppsCreate.on)
      .delete(deleteApiApps.on);


/**
 * /auth/api/access
 */
router.route('/api/access')
      .get(getApiAccessToken.on)
      .delete(deleteApiAccessToken.on);


// close session 
router.use(function(req, res) {
    res.status(404).redirect('/404');
});
  
  
  
module.exports.router = router;