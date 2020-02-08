

let express = require('express');
let router = express.Router();


let getViewSignin = require('./get-view-signin');
let getViewSignup = require('./get-view-signup');
let postSigninVerify = require('./post-signin-verify')


/**
 *  views
 */

// get view: /signin 
router.get('/signin', getViewSignin.on);

// get view: /signup  
router.get('/signup', getViewSignup.on);


/**
 *  APIs
 */
// Check if ID token is valid or not. 
// If valid, redirect to service page. 
// if not & signed in via OAuth providers, redirect to signup page.
router.post('/signin/verify', postSigninVerify.on);



// close session 
router.use(function(req, res) {
    res.json({error:'IncorrectAPI'});
    res.status(404).end();
});
  
  
  
module.exports.router = router;