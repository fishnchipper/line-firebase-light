



function on(req, res, next) {
    
    //console.log(" ==== ", req.decodedSession);
    let decodedSession = req.decodedSession;
    let displayName = (decodedSession.name)? decodedSession.name : decodedSession.email;
    let values = {firstInitial: displayName.charAt(0).toUpperCase()};

    
    res.render('./service/index', values, function(err, html) {
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