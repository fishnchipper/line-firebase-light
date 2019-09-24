/**
 * main routes
 */
let request = require('request');
let environment = require('../environment/environment');


/**
* main page 
*/
function main(req, res, next) {

   let values = '';

   // display status of sign in
   res.render('./main', values, function(err, html) {
       if(err) {
           console.log(err);
           res.status(err.status).end();
       }else {
           res.set('Content-Type', 'text/html');
           res.send(html);
       }
   });
}


/**
* Sign In page 
*/
function signIn(req, res, next) {

    let values = '';
 
    // display status of sign in
    res.render('./sign-in', values, function(err, html) {
        if(err) {
            console.log(err);
            res.status(err.status).end();
        }else {
            res.set('Content-Type', 'text/html');
            res.send(html);
        }
    });
 }

 /**
* 
* login check and return a valid JWT
* 
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
function login(req, res, next) {

    console.log(">>>> ", req.body);
 
    let url = environment.ale.url + "/login";
    console.log(">>>> ", url);
 
    request.post({
        "headers": { "content-type": "application/json" },
        "url": url,
        "strictSSL": false, // for self-signed certificate
        "body": JSON.stringify({
            "username": req.body.username,
            "password": req.body.password
        })
    }, (error, response, body) => {
        if(error) {
            console.log(">>>> ", error);
            res.json({
                success: false,
                code: 'communicationError',
                message: error.code,
                token: ''
              });
        }else {
            result = JSON.parse(body);
            console.log(">>>> ", body);
            res.json({
                success: result['success'],
                code: result['code'],
                message: result['message'],
                user: result['user'],
                token: result['token']
            });
        }
    });
 
 }


function end(req, res) {

    let values = '';
    res.status(404).render('./no-page', values, function(err, html) {
        if(err) {
            console.log(err);
            res.status(err.status).end();
        }else {
            res.set('Content-Type', 'text/html');
            res.send(html);
        }
    });
}


module.exports.main = main;
module.exports.signIn = signIn;
module.exports.loginHandler = login;
module.exports.endSession = end;