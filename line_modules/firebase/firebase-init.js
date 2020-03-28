/**
 * Initialize Google firebase access
 * 
 * 
 * node global constant/variable syntax: ___<vairable name>___
 */
"use strict";

/**
 * interface - function initAuthService() implementation
 */
function initAuthService(_firebaseKeyFilename) {

    //
    // init firebase admin as global nodejs variable
    //
    global.___firebaseAdmin___ = require('firebase-admin');
    ___firebaseAdmin___.initializeApp({
        credential: ___firebaseAdmin___.credential.cert(global.__line_options__.keyFilename),
        databaseURL: global.__line_options__.databaseURL
    });
}
exports.initAuthService = initAuthService;

/**
 * interface - function initDBService() implementation
 */
function initDBService() {

    // for access to firestore
    const Firestore = require('@google-cloud/firestore');
    global.___firestore___ = new Firestore(global.__line_options__);
}
exports.initDBService = initDBService;
