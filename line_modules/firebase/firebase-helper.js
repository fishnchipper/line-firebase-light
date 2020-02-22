/**
 * helper for firebase operation
 */
"use strict";

let __user__ = require('../models/user');

let FirebaseAuthHelper = (function() {
    /**
     * @constructor
     */
    function FirebaseAuthHelper() {}

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
          .then((decodedToken) => {
            console.log("+++ customer claims: ", decodedToken);
            // Verify user is eligible for additional privileges.
            if (typeof decodedToken.email !== 'undefined' &&
                typeof decodedToken.email_verified !== 'undefined' &&
                decodedToken.email_verified) {
                // verified
                __user__.__uid = decodedToken.user_id;
                __user__.name = decodedToken.name;
                __user__.picture = decodedToken.picture;
                __user__.email = decodedToken.email;
                __user__.authProvider = 'google';
                resolve(__user__);
            } else {
                // Return nothing.
                reject('ineligible');
            }
          });
        });
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
  FirebaseDBHelper.prototype.setUser = function(__user) {

    return new Promise((resolve, reject) => {
              // query data in firebase
              ___firestore___.collection("users").doc(`${__user.__uid}`).set(__user).then(() => {
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
