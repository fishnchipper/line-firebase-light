

let line = require('../../line_modules/line');
let authAdapter = line.createAuthAdapter();

function on(req, res, next) {
    
  // Get the ID token passed and the CSRF token.
  const idToken = req.body.idToken.toString();
  const csrfToken = req.body.csrfToken.toString();

  console.log("==== idToken: ", idToken);
  console.log("==== csrfToken: ", csrfToken, " ===? ", req.cookies);
  if (csrfToken !== req.cookies.csrfToken) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
    return;
  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  // Verify the ID token and decode its payload.
  authAdapter.verifyIdToken(idToken)
  .then((user) => {
    console.log("=== verified user: ", user);
    if(user.signUpStatus === true) {

      // user is signed up. proceed with sign in session
      authAdapter.createSessionCookie(idToken, expiresIn)
      .then((sessionCookie) => {
        console.log("==== sessionCookie: ", sessionCookie);
    
        // Set cookie policy for session cookie.
        const options = {maxAge: expiresIn, httpOnly: true, secure: true};
        res.cookie('session', sessionCookie, options);
        res.end(JSON.stringify({status: 'signedUp'}));
      })
      .catch((err) => {
        console.log("==== err: ", err);
        res.status(401).send('UNAUTHORIZED REQUEST!');
      });
    }else {
      res.end(JSON.stringify({
        status: 'signUpRequired' // verified but 
      }));
    }
  })
  .catch((err) => {
    // Tell client to redirect to sign up page.
    console.log("==== reject reason: ", err);
    res.status(401).send('UNAUTHORIZED REQUEST!');
  })




}

module.exports.on= on;