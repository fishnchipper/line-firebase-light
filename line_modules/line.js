
/**
 * line module helping DB access from line app shell
 * 
 * v0.1.0
 */
"use strict";

let firebase = require('./firebase/firebase-init');
let firebaseHelper = require('./firebase/firebase-helper');

/**
 * Init Auth Service
 * 
 * @param {string} __provider authentication service provider
 */
function initAuthService(__provider) {
    if(__provider === 'firebase') {
        firebase.initAuthService();
    }
}
exports.initAuthService = initAuthService;

/**
 * Create Auth adapter
 */
function createAuthAdapter() {
    // lineDB is a global variable in nodejs which is set in initDbAccess()
    if(___lineDb___ === 'firebase') {
        return firebaseHelper.createFirebaseAuthHelper();
    }
}
exports.createAuthAdapter = createAuthAdapter;

/**
 * Init DB Service
 * 
 * @param {string} __provider db service provider
 */
function initDBService(__provider) {

    if(__provider === 'firebase') {
        firebase.initDBService();
    }
    /* add other db access init codes here, for example
    else if(__dbService === 'documentDB') {
        documentDB.init();
    }
    */
}
exports.initDBService = initDBService;

/**
 * Create DB adapter
 */
function createDBAdapter() {
    // lineDB is a global variable in nodejs which is set in initDbAccess()
    if(___lineDb___ === 'firebase') {
        return firebaseHelper.createFirebaseDBHelper();
    }
}
exports.createDBAdapter = createDBAdapter;