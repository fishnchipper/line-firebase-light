
let line = require('../../line_modules/line-firebase');
let authAdapter = line.createAuthAdapter();


function on(req, res, next) {
    
    // Get the ID token passed.
    let userId = req.body.userId;
  
    console.log("==== userId: ", userId);
    // Verify the ID token and decode its payload.
    authAdapter.signUpUser(userId)
    .then(() => {
        console.log("==== user added");
        // Tell client to refresh token on user.
        res.end(JSON.stringify({
            status: 'success'
        }));
    })
    .catch((err) => {
        // Tell client to redirect to sign up page.
        console.log("==== error : ", err);
        res.end(JSON.stringify({
            status: 'error'
        }));
    })
}

module.exports.on= on;