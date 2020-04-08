



function on(req, res, next) {
    
    let user = req.decodedSession;

    res.render('./service/settings', "", function(err, html) {
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