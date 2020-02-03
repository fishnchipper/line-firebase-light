/**
 * main routes
 */


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
module.exports.endSession = end;