
/**
 * line module helping DB access from line app shell
 * 
 * v0.1.0
 */
"use strict";

let firebase = require('./firebase/firebase-init');
let firebaseHelper = require('./firebase/firebase-helper');

function setup(__options) {
    global.__line_options__ = __options;
}
exports.setup = setup;

/**
 * Init Auth Service
 * 
 */
function initAuthService() {
        firebase.initAuthService();
}
exports.initAuthService = initAuthService;

/**
 * Create Auth adapter
 */
function createAuthAdapter() {
    return firebaseHelper.createFirebaseAuthHelper();
}
exports.createAuthAdapter = createAuthAdapter;

/**
 * Init DB Service
 * 
 */
function initDBService() {
    firebase.initDBService();
}
exports.initDBService = initDBService;

/**
 * Create DB adapter
 */
function createDBAdapter() {
    return firebaseHelper.createFirebaseDBHelper();
}
exports.createDBAdapter = createDBAdapter;