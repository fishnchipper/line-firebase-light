const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var uuid = require('uuid-random');

let lineFirbase = require('../../line_modules/line-firebase');
let dbAdapter = lineFirbase.createDBAdapter();



function on(req, res, next) {
    console.log("++++ api ++++ /app called");

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
                    var appProfile = { __id: appId, userId: user.user_id, aat: Date.now(), publicKey: _publicKey};
                    dbAdapter.setApp(appProfile)
                    .then((result) => {
                        console.log("++++ result: ", result);
                        res.json({code: 'api.app.add', message:"oauth app is successfully added", payload:{ app_id: appId, private_key: _privateKey }});
                    })
                    .catch((e)=>{
                        res.status(400).json({code: 'api.app.error', message:'oauth app add error'});  
                    })
                    
                }
            });
}

module.exports.on= on;