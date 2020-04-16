



function on(req, res, next) {
    
    console.log("++++ api ++++ {get} /auth/signup called");

    let values = '';

    res.render('./auth/sign-up', values, function(err, html) {
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