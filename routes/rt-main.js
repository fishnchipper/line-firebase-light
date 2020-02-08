/**
 * main routes
 */


/**
* main page 
*/
function main(req, res, next) {

   // display main page
   res.render('./main', '', function(err, html) {
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
module.exports.endSession = end;