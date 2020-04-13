const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var uuid = require('uuid-random');

let lineFirbase = require('../../line_modules/line-firebase');
let dbAdapter = lineFirbase.createDBAdapter();



function on(req, res, next) {
    console.log("++++ api ++++ {post} /app called");

    // Get the app name passed.
    let appName = req.body.appName;
    console.log("++++ appName: ", appName);

    let user = req.decodedSession;
    console.log("++++ user session: ", user);

    const appId = appName + "-" + uuid();
    const passPhrase = appId;
    console.log("++++ passPhrase: ", passPhrase);

    crypto.generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: passPhrase
            }
            }, (err, _publicKey, _privateKey) => {
                // Handle errors and use the generated key pair.
                if(err) {
                    res.status(400).json({code: 'api.app.error', message:'oauth app add error'});                    res.status(400).json({code: 'api.app.error', message:"key pair creation fails."});
                }else {
                    //console.log(privateKey);
                    //console.log(publicKey);
                    var appProfile = { __id: appId, 
                                       __userUID: user.user_id, 
                                       __aat: Date.now(),
                                       name: appName, 
                                       publicKey: _publicKey};
                    dbAdapter.addDocument('applications', appProfile.__id, appProfile)
                    .then((result) => {
                        console.log("++++ result: ", result);
                        appProfile.privateKey = _privateKey;
                        res.json({code: 'api.app.operation', message:"oauth app is successfully added", payload:appProfile});
                    })
                    .catch((e)=>{
                        res.status(400).json({code: 'api.app.error', message:'oauth app add error'});  
                    })
                    
                }
            });
}

module.exports.on= on;