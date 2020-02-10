

// init firebase admin
let admin = require('firebase-admin');
let environment = require('../../environment/environment');
admin.initializeApp({
  credential: admin.credential.cert(environment.firebase.keyFilename),
  databaseURL: "https://line-7e593.firebaseio.com"
});

// for access to firestore
const Firestore = require('@google-cloud/firestore');


function __getUser(__uid) {
  let user = null;
  const firestore = new Firestore(environment.firebase);
  let query = firestore.collection('users').where('__uid','==', __uid);

  query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
          console.log('No uid found in line');
          return user;
      }else {
          /*let docs = querySnapshot.docs;*/
          querySnapshot.forEach(doc => {
            user = doc;
          });          
          return user             
      }
  })
  .catch(err => {
    console.log('Error - query user', err);
    return null;
  });
}

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

        // check if the user is signed up.
        const user = __getUser(decodedToken.user_id);
        if(!user) {
          // Tell client to redirect to sign up page.
          res.end(JSON.stringify({
            status: 'signuprequired'
          }));
        }else {
        
          // Add custom claims for additional privileges.
          admin.auth().setCustomUserClaims(decodedToken.sub, {
            role: user.role
          })
          .then(() => {
            // Tell client to refresh token on user.
            res.end(JSON.stringify({
                status: 'verified'
              }));
            });
        }
    } else {
        // Return nothing.
        res.end(JSON.stringify({status: 'ineligible'}));
    }
  });
}

module.exports.on= on;