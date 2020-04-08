/**
 * helper for firebase operation
 */
"use strict";

let FirebaseAuthHelper = (function() {
    /**
     * @constructor
     */
    function FirebaseAuthHelper() {}

    FirebaseAuthHelper.prototype.createSessionCookie = function(__idToken, __expiresIn) {
      let self = this;

      return new Promise((resolve, reject) => {

          // Create the session cookie. This will also verify the ID token in the process.
          // The session cookie will have the same claims as the ID token.
          // To only allow session cookie setting on recent sign-in, auth_time in ID token
          // can be checked to ensure user was recently signed in before creating a session cookie.
          ___firebaseAdmin___.auth().createSessionCookie(__idToken, {expiresIn:__expiresIn})
            .then((sessionCookie) => {
              // Set cookie policy for session cookie.
              console.log("++++ sessionCookie: ", sessionCookie);
              resolve(sessionCookie);
            }, error => {
              console.log("++++ error: ", error);
              reject(error);
            });
      });
    }
    /**
     * verify firebase ID token
     * 
     * @param {string} __idToken The __idToken to verify.
     * @return {Promise<user>} A promise fulfilled with user document; otherwise, a rejected promise
     */
    FirebaseAuthHelper.prototype.verifyIdToken = function(__idToken) {
        let self = this;

        return new Promise((resolve, reject) => {
          ___firebaseAdmin___.auth().verifyIdToken(__idToken)
          .then((decodedIdToken) => {
            console.log("+++ customer claims: ", decodedIdToken);

            // Verify user is eligible for additional privileges.
            if (typeof decodedIdToken.email !== 'undefined' &&
                typeof decodedIdToken.email_verified !== 'undefined') //&&
                //decodedIdToken.email_verified) 
                {

                // Only process if the user just signed in in the last 5 minutes.
                if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
                  // Create session cookie and set it.
                  return resolve(decodedIdToken);
                }
                // return recent sign-in required message
                reject('recentSignInRequired');
            } else {
                // Return nothing.
                reject({code: 'email-vefication-failed', message: 'Email has not been vierified yet. Please verify your email delivered.'});
            }
          });
        });
    }

    /**
     * check line_signup_status
     * 
     * @param {string} __uid __uid to check line_signup_status
     * @return {Promise<string>} A promise fulfilled with status; otherwise, a rejected promise
     */
    FirebaseAuthHelper.prototype.signUpStatus = function(__uid) {
        return new Promise((resolve, reject) => {
          ___firebaseAdmin___.auth().getUser(__uid)
          .then(function(userRecord) {
            let user = userRecord.toJSON();
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully fetched user data:', user);
            if(user.customClaims.line_signup_status === true) {
              resolve('signedUp');
            }else {
              reject('signUpRequired')
            }
          })
          .catch(function(error) {
            console.log('Error fetching user data:', error);
            reject(error);
          });
        })
    }


    /**
     * set line_signup_status user claim
     * 
     * @param {string} __uid __uid to set line_signup_status user claim.
     * @return {Promise<string>} A promise fulfilled with status; otherwise, a rejected promise
     */
    FirebaseAuthHelper.prototype.signUpUser = function(__uid) {
      return new Promise((resolve, reject) => {

        ___firebaseAdmin___.auth().setCustomUserClaims(__uid, {line_signup_status: true})
        .then(() => {
          // The new custom claims will propagate to the user's ID token the
          // next time a new one is issued.
          resolve('signedUp');
        })
        .catch(function(error) {
          console.log('Error setCustomUserClaims:', error);
          reject(error);
        });

      })
  }
    return FirebaseAuthHelper;
})();
exports.FirebaseAuthHelper = FirebaseAuthHelper;

let FirebaseDBHelper = (function() {
  /**
   * @constructor
   */
  function FirebaseDBHelper() {}

  /**
   * query a user in firebase
   * 
   * @param {string} __uid The __uid to query.
   * @return {Promise<user>} A promise fulfilled with user document; otherwise, a rejected promise
   */
  FirebaseDBHelper.prototype.getUser = function(__uid) {

    let query = ___firestore___.collection('users').where('__uid','==', __uid);

    return new Promise((resolve, reject) => {

            // query data in firebase
            query.get().then(querySnapshot => {
                if (querySnapshot.empty) {
                    reject("nil");
                }else {
                    /*let docs = querySnapshot.docs;*/
                    querySnapshot.forEach(doc => {
                      resolve(doc.data());
                    });                      
                }
            })
            .catch(err => {
              reject("fail - firebase query: ", err);
            });

          })
  }

  /**
   * add a user in firebase
   * 
   * @param {object} __user The __user to add.
   * @return {Promise<string>} A promise fulfilled with status; otherwise, a rejected promise
   */
  FirebaseDBHelper.prototype.setApp = function(__app) {

    return new Promise((resolve, reject) => {
              // query data in firebase
              ___firestore___.collection("applications").doc(`${__app.__id}`).set(__app).then(() => {
                resolve("success");                 
              })
              .catch(err => {
                reject("fail - firebase set: ", err);
              });

          })
  }
  return FirebaseDBHelper;
})();
exports.FirebaseDBHelper = FirebaseDBHelper;

function createFirebaseAuthHelper() {
  return new FirebaseAuthHelper();
}
exports.createFirebaseAuthHelper = createFirebaseAuthHelper;

function createFirebaseDBHelper() {
  return new FirebaseDBHelper();
}
exports.createFirebaseDBHelper = createFirebaseDBHelper;
