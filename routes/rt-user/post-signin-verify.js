
let admin = require('firebase-admin');
let serviceAccount = require("../../environment/line-7e593-firebase-adminsdk-o2cuu-f35d7e3d3f.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://line-7e593.firebaseio.com"
});


function on(req, res, next) {
    
  // Get the ID token passed.
  let idToken = req.body.idToken;
  
  console.log("==== idToken: ", idToken);

  // Verify the ID token and decode its payload.
  admin.auth().verifyIdToken(idToken)
  .then((decodedToken) => {
    console.log("==== customer claims: ", decodedToken);
    // Verify user is eligible for additional privileges.
    if (typeof decodedToken.email !== 'undefined' &&
        typeof decodedToken.email_verified !== 'undefined' &&
        decodedToken.email_verified) {
      // Add custom claims for additional privileges.
      admin.auth().setCustomUserClaims(decodedToken.sub, {
        role: 'admin'
      })
      .then(() => {
        // Tell client to refresh token on user.
        res.end(JSON.stringify({
            status: 'success'
          }));
        });
    } else {
      // Return nothing.
      res.end(JSON.stringify({status: 'ineligible'}));
    }
  });
}

module.exports.on= on;