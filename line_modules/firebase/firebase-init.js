/**
 * Initialize Google firebase access
 * 
 * 
 * node global constant/variable syntax: ___<vairable name>___
 */
"use strict";

let environment = require('./firebase-environment');


/**
 * interface - function initAuthService() implementation
 */
function initAuthService() {

    //
    // init firebase admin as global nodejs variable
    //
    global.___firebaseAdmin___ = require('firebase-admin');
    ___firebaseAdmin___.initializeApp({
        credential: ___firebaseAdmin___.credential.cert(environment.__firebase__.keyFilename),
        databaseURL: "https://line-7e593.firebaseio.com"
    });
}
exports.initAuthService = initAuthService;

/**
 * interface - function initDBService() implementation
 */
function initDBService() {

    // for access to firestore
    const Firestore = require('@google-cloud/firestore');
    global.___firestore___ = new Firestore(environment.__firebase__);
    global.___lineDb___ = 'firebase';
}
exports.initDBService = initDBService;
