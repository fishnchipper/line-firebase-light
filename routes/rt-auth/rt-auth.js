

let express = require('express');
let router = express.Router();


let checkSessionForAuth = require('../../middleware/check-session-forauth');
let getSignIn = require('./get-signin');
let getSignUp = require('./get-signup');
let postSignUp = require('./post-signup');
let postSignIn = require('./post-signin');
let postSignOut = require('./post-signout');


/**
 * /auth/signin
 */
router.route('/signin')
      .get(checkSessionForAuth.on, getSignIn.on)
      .post(postSignIn.on);

/**
 * /auth/signup
 */
router.route('/signup')
      .get(checkSessionForAuth.on, getSignUp.on)
      .post(postSignUp.on);

/**
 * /auth/signout
 */
router.route('/signout')
      .post(postSignOut.on);


// close session 
router.use(function(req, res) {
    res.status(404).redirect('/404');
});
  
  
  
module.exports.router = router;