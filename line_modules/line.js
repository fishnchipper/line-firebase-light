
"use strict";
/**
 * line v0.1.0
 */

let firebase = require('./firebase/firebase-init');
let firebaseHelper = require('./firebase/firebase-helper');


function initDbAccess(__dbService) {

    if(__dbService === 'firebase') {
        firebase.init();
    }
    /* add other db access init codes here, for example
    else if(__dbService === 'documentDB') {
        documentDB.init();
    }
    */
}

/**
 * db helper
 */
function createDbAdapter() {
    // lineDB is a global variable in nodejs which is set in initDbAccess()
    if(___lineDb___ === 'firebase') {
        return firebaseHelper.createFirebaseHelper();
    }
}


exports.initDbAccess = initDbAccess;
exports.createDbAdapter = createDbAdapter;