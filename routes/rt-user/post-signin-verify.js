let firebaseHelper = require('../../line_modules/firebase/firebase-helper');
let fbHelper = firebaseHelper.createFirebaseHelper();


function on(req, res, next) {
    
    // Get the ID token passed.
    let idToken = req.body.idToken;
    console.log("==== idToken: ", idToken);

    // Verify the ID token and decode its payload.
    fbHelper.verifyIdToken(idToken)
    .then((user) => {
      console.log("==== user: ", user);
      // Tell client to refresh token on user.
      res.end(JSON.stringify({
        status: 'verified'
      }));
    })
    .catch((err) => {
      // Tell client to redirect to sign up page.
      console.log("==== reject reason: ", err);
      res.end(JSON.stringify({
        status: 'signuprequired'
      }));
    })

}

module.exports.on= on;