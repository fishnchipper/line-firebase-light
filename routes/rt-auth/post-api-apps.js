const crypto = require('crypto');
const jwt = require('jsonwebtoken');



function on(req, res, next) {
    console.log("++++ api ++++ /auth/api/apps called");

    // Get the app name passed.
    let appName = req.body.appName;
    console.log("++++ appName: ", appName);



    const passPhrase = appName;

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
            }, (err, publicKey, privateKey) => {
                // Handle errors and use the generated key pair.
                if(err) {
                    res.status(400).json({code: 'session.error', message:'invalid uuid'});                    res.status(400).json({code: 'api.app.error', message:"key pair creation fails."});
                }else {
                    console.log(privateKey);
                    console.log(publicKey);
                    var appAuthKey = { private_key: privateKey };
                    res.json({code: 'api.app.add', message:"oauth app is successfully added", payload:appAuthKey});
                }
            });

}

module.exports.on= on;