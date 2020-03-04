


function on(req, res, next) {

    console.log("++++ api ++++ /auth/signout called");
    res.clearCookie('session');
    res.status(200).send({ status: 'success'});
}

module.exports.on= on;