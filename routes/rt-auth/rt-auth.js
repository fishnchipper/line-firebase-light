

let express = require('express');
let router = express.Router();


let checkSession = require('../../middleware/check-session');
let checkSessionForAuth = require('../../middleware/check-session-forauth');
let getSignIn = require('./get-signin');
let getSignUp = require('./get-signup');
let postSignUp = require('./post-signup');
let postSignIn = require('./post-signin');
let postSignOut = require('./post-signout');



/**
 *  views
 */

// get view: /signin 
router.get('/signin', checkSessionForAuth.on, getSignIn.on);

// get view: /signup 
router.get('/signup', checkSessionForAuth.on, getSignUp.on);


/**
 *  APIs
 */
router.post('/signin', postSignIn.on);

router.post('/signout', postSignOut.on);

/* TODO: add session check to /signup */
router.post('/signup', postSignUp.on);



// close session 
router.use(function(req, res) {
    res.status(404).redirect('/404');
});
  
  
  
module.exports.router = router;