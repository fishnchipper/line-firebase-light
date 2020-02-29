

let express = require('express');
let router = express.Router();


let getViewSignIn = require('./get-view-signin');
let getViewSignUp = require('./get-view-signup');
let postSigninVerify = require('./post-signin-verify')
let postSignUp = require('./post-signup');
let postSignIn = require('./post-signin');


/**
 *  views
 */

// get view: /signin 
router.get('/signin', getViewSignIn.on);

// get view: /signup 
router.get('/signup', getViewSignUp.on);


/**
 *  APIs
 */
// Check if ID token is valid or not. 
// If valid, redirect to service page. 
// if not & signed in via OAuth providers, redirect to signup page.
router.post('/signin/verify', postSigninVerify.on);

router.post('/signin', postSignIn.on);

/* TODO: add session check to /signup */
router.post('/signup', postSignUp.on);



// close session 
router.use(function(req, res) {
    res.json({error:'IncorrectAPI'});
    res.status(404).end();
});
  
  
  
module.exports.router = router;