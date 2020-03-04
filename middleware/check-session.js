
"use strict";

function on(req, res, next) {

    const sessionCookie = req.cookies.session || '';
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    //console.log("==== session cookie: ", sessionCookie);
    ___firebaseAdmin___.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        console.log("==== session verified - decodedClaims: ", decodedClaims);
        req.decodedSession = decodedClaims;
        next();
      })
      .catch(error => {
        // Session cookie is unavailable or invalid. Force user to login.
        //console.log("==== err: ", error);
        res.status(401).render('./invalid-session');
      });
}


exports.on = on;