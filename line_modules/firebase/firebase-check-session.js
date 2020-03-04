
"use strict";

function on(req, res, next) {

    const sessionCookie = req.cookies.session || '';
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    admin.auth().verifySessionCookie(
      sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        serveContentForUser('/profile', req, res, decodedClaims);
      })
      .catch(error => {
        // Session cookie is unavailable or invalid. Force user to login.
        res.redirect('/login');
      });
      
    next();
}


exports.on = on;