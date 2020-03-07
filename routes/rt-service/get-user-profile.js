



function on(req, res, next) {
    
    let user = req.decodedSession;
    let values = { userId: user.user_id, userImage:(user.picture)? user.picture: "/img/sign-in.png", userName: (user.name)?user.name:user.email.split(/@(.+)/)[0], userEmail:user.email, userEmailVerified: user.email_verified};

    res.render('./service/profile', values, function(err, html) {
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