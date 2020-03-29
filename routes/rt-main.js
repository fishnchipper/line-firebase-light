/**
 * main routes
 */


/**
* main page 
*/
function main(req, res, next) {

   // display main page
   res.render('./main', { description: process.env.npm_package_description, version: process.env.npm_package_version }, function(err, html) {
       if(err) {
           console.log(err);
           res.status(err.status).end();
       }else {
           res.set('Content-Type', 'text/html');
           res.send(html);
       }
   });
}


function error(req, res, next) {
    // display main page
    res.status(500).render('./error', '', function(err, html) {
        if(err) {
            console.log(err);
            res.status(err.status).end();
        }else {
            res.set('Content-Type', 'text/html');
            res.send(html);
        }
    });
 }


function noResource(req, res) {

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
module.exports.error = error;
module.exports.noResource = noResource;