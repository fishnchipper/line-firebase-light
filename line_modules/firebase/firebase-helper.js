"use strict";
/**
 * helper for firebase operation
 */
let FirebaseHelper = (function() {
    /**
     * @constructor
     */
    function FirebaseHelper() {}

    /**
     * verify firebase ID token
     * 
     * @param {string} __idToken The __idToken to verify.
     * @return {Promise<user>} A promise fulfilled with user document; otherwise, a rejected promise
     */
    FirebaseHelper.prototype.verifyIdToken = function(__idToken) {
        let self = this;

        return new Promise((resolve, reject) => {
          firebaseAdmin.auth().verifyIdToken(__idToken)
          .then((decodedToken) => {
            console.log("+++ customer claims: ", decodedToken);
            // Verify user is eligible for additional privileges.
            if (typeof decodedToken.email !== 'undefined' &&
                typeof decodedToken.email_verified !== 'undefined' &&
                decodedToken.email_verified) {
    
                  self.getUser(decodedToken.user_id)
                  .then((user) => {
                      resolve(user);
                  })
                  .catch((err) => {
                      reject(err);
                  })
    
            } else {
                // Return nothing.
                reject('ineligible');
            }
          });
        });
    }

    /**
     * query a user in firebase
     * 
     * @param {string} __uid The __uid to query.
     * @return {Promise<user>} A promise fulfilled with user document; otherwise, a rejected promise
     */
    FirebaseHelper.prototype.getUser = function(__uid) {

      let query = firestore.collection('users').where('__uid','==', __uid);

      return new Promise((resolve, reject) => {

              // query data in firebase
              query.get().then(querySnapshot => {
                  if (querySnapshot.empty) {
                      console.log('+++ No uid found in line');
                      reject("No uid found");
                  }else {
                      /*let docs = querySnapshot.docs;*/
                      querySnapshot.forEach(doc => {
                        console.log('==== user:', doc.data());
                        resolve(doc.data());
                      });                      
                  }
              })
              .catch(err => {
                console.log('Error - query user', err);
                reject("error - during firebase query");
              });

            })
    }
    return FirebaseHelper;
})();
exports.FirebaseHelper = FirebaseHelper;

function createFirebaseHelper() {
  return new FirebaseHelper();
}
exports.createFirebaseHelper = createFirebaseHelper;
