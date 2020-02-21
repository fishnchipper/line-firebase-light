

const ___firebase___ = {
    keyFilename: __dirname + '/firebase-serverkey.json'
};


/**
 * firebase init
 */
function init() {

    //
    // init firebase admin as global nodejs variable
    //
    global.___firebaseAdmin___ = require('firebase-admin');
    ___firebaseAdmin___.initializeApp({
        credential: ___firebaseAdmin___.credential.cert(___firebase___.keyFilename),
        databaseURL: "https://line-7e593.firebaseio.com"
    });

    // for access to firestore
    const Firestore = require('@google-cloud/firestore');
    global.___firestore___ = new Firestore(___firebase___);
    global.___lineDb___ = 'firebase';
}

exports.init = init;
