
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
let Line = require('@fishnchipper/line-firebase-admin');
let dbAdapter = Line.firebase.createDBAdapter();
var uuid = require('uuid-random');


var error = {};
var appProfile = {
    profile: {},
    authenticate: function(_privateKey) { 
        return new Promise((resolve, reject) => {
            // verify credential of the private key
            var randomString = uuid();
            const buffer = Buffer.from(randomString);
            try {  
                const passPhrase = appProfile.profile.__id;
                const encryptedBuffer = crypto.privateEncrypt(
                                {key: _privateKey, passphrase: passPhrase, padding:crypto.constants.RSA_PKCS1_PADDING}, 
                                buffer
                                );

                //console.log(" buffer: ", buffer.toString());
                //console.log(" encrypted buffer: ", encryptedBuffer.toString());

                const decryptedBuffer = crypto.publicDecrypt(
                                appProfile.profile.publicKey, 
                                encryptedBuffer
                                );
                //console.log(" dcrypted buffer: ", decryptedBuffer.toString());
                if(buffer.toString() == decryptedBuffer.toString()) {
                    resolve(appProfile);
                }else {
                    error.code = "auth.app.fail";
                    error.message = "authentication fail";
                    reject(error);
                }
            }catch(e) {
                console.log("++++ error: ", e);
                reject(e);
            }
        });
    },
    createAccessToken: function() {
        return new Promise((resolve, reject) => {
            const kprofile = ___pkiKeyPairsForAccessKeyGen___.get('kprofile');

            // issuing an OAuth2.0 access token
            jwt.sign(
                {   iss: "line-firebase",
                    aud: "https://localhost:65000/api/",
                    sub: appProfile.profile.__userUID,
                    client_id: appProfile.profile.__id
                }, 
                kprofile.privateKey, 
                { algorithm: 'RS256', expiresIn: 60*60},
                (err, token) => {
                    if(err) {
                        //console.log("err: ", err);
                        reject(err);
                    }else {
                        //console.log(" jwt access token: +", token, "+");
                        resolve(token);
                    }
                });
        });
    }
}

function _getAppProfile(_appId) {

    return new Promise((resolve, reject) => {

        var profile = global.___appProfileList___.get(_appId);
        //console.log("++++ profile: ", profile);
        if(typeof profile === "undefined") {
            dbAdapter.getDocumentsWithDocID("applications", _appId)
            .then((docs) => {
                //console.log("++++ docs retrieved: ", docs);
                if(docs == 'nil') {
                    error.code = "auth.app.fail";
                    error.message = "no app profile found";
                    reject(error);
                }else {
                    profile = docs[0];
                    //console.log("++++ appProfile retrieved: ", profile);
                    global.___appProfileList___.set(_appId, profile);
                }
                appProfile.profile = profile;
                resolve(appProfile);
            })
            .catch((e) => {
                console.log("++++ error: ", e);
                reject(e);
            })
        }else {
            appProfile.profile = profile;
            resolve(appProfile);
        }
    });
}

function on(req, res, next) {
    
    console.log("++++ api ++++ {put} /auth/app called");

    // Get serverkey passed.
    const keyProfile = req.body;
    //console.log("++++ body: ", req.body);

     //    - verify the credential using {private_key} given
     //        - query {passphrase, public_key} by using {app_id} given
     //        - try crypto.privateEncrypt() using {private_key} & {passphrase}
     //        - double-check the {private_key} by trying crypto.publicDecrypt using {public_key}

     
     _getAppProfile(keyProfile.app_id)
     .then((appProfile)=>{
        console.log("     app id: ", appProfile.profile.__id);
        console.log("     app profile exists.");
        return appProfile.authenticate(keyProfile.private_key);
     })
     .then((appProfile)=>{
        console.log("     authentication successful");
        return appProfile.createAccessToken();
     })
     .then((accessToken) => {
        console.log("     {to-be OAuth2.0} access token is issued");
        res.status(200).json({code: 'auth.app', message:'authentication successful.', payload: accessToken});
     })
     .catch((e)=>{
        console.log("++++ error: ", e.message);
        res.status(400).json({code: 'auth.app.fail', message:e.message});
     });
}

module.exports.on= on;