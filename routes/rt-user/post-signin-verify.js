

let line = require('../../line_modules/line');
let authAdapter = line.createAuthAdapter();
let dbAdapter = line.createDBAdapter();

function on(req, res, next) {
    
    // Get the ID token passed.
    let idToken = req.body.idToken;
    console.log("==== idToken: ", idToken);

    // Verify the ID token and decode its payload.
    authAdapter.verifyIdToken(idToken)
    .then((user) => {

      //
      // auth provider successfully verified the user
      // add another layer of user check such as user object is in db, role, paid|free user 
      //
      dbAdapter.getUser(user.__uid)
      .then((user) => {

          // Tell client to refresh token on user.
          res.end(JSON.stringify({
            status: 'verified'
          }));
      })
      .catch((err) => {
        console.log("==== reject reason: ", err);
        if(err === 'nil') {
          res.end(JSON.stringify({
            status: 'signuprequired'
          }));
        }else {
          res.end(JSON.stringify({
            status: 'error'
          }));
        }
      })


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