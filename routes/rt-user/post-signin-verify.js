

let line = require('../../line_modules/line');
let authAdapter = line.createAuthAdapter();

function on(req, res, next) {
    
    // Get the ID token passed.
    let idToken = req.body.idToken;
    console.log("==== idToken: ", idToken);

    // Verify the ID token and decode its payload.
    authAdapter.verifyIdToken(idToken)
    .then((user) => {

      console.log("=== verified user: ", user);
      if(user.signUpStatus === true) {
        res.end(JSON.stringify({
          status: 'signedUp' // verified and
        }));
      }else {
        res.end(JSON.stringify({
          status: 'signUpRequired' // verified but 
        }));
      }
    })
    .catch((err) => {
      // Tell client to redirect to sign up page.
      console.log("==== reject reason: ", err);
      res.end(JSON.stringify({
        status: 'verificationFailed'
      }));
    })

}

module.exports.on= on;