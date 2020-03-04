
"use strict";

function on(req, res, next) {

    const sessionCookie = req.cookies.session || '';
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    //console.log("==== session cookie: ", sessionCookie);
    ___firebaseAdmin___.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        console.log("==== valid session");
        res.status(418).redirect('/service');
      })
      .catch(error => {
        // Session cookie is unavailable or invalid. Force user to login.
        //console.log("==== err: ", error);
        console.log("==== invalid session");
        next();
      });
}


exports.on = on;