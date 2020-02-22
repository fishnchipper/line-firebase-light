
let line = require('../../line_modules/line');
let dbAdapter = line.createDBAdapter();


function on(req, res, next) {
    
    // Get the ID token passed.
    let userObj = req.body.userObj;
  
    console.log("==== userObt: ", userObj);
    // Verify the ID token and decode its payload.
    dbAdapter.setUser(userObj)
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