



function on(req, res, next) {

    console.log("++++ api ++++ {get} /auth/signin called");
    
    let values = '';

    res.render('./auth/sign-in', values, function(err, html) {
        if(err) {
            console.log(err);
            res.status(err.status).end();
        }else {
            res.set('Content-Type', 'text/html');
            res.send(html);
        }
    });
}

module.exports.on= on;