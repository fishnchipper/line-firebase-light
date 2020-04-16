const crypto = require('crypto');
var uuid = require('uuid-random');


"use strict";

/**
 * Generate PKI asyncronous key pairs used for OAuth2.0 access key generation
 * 
 */
function generateAKeyPairsForAccessKey() {

    // [OTHER METHODS NEED TO BE CONSIDERED] PKI asyncronous key pairs used for OAuth2.0 access key generation
    global.___pkiKeyPairsForAccessKeyGen___ = new Map();
    let passPhrase = uuid();
    
    crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
        }, (err, _publicKey, _privateKey) => {

            if(err) {
                return null;
            }else {
                var keyProfile = { publicKey: _publicKey, privateKey: _privateKey, passPhrase: passPhrase};
                global.___pkiKeyPairsForAccessKeyGen___.set('kprofile', keyProfile);

            }

        });
}
exports.generateAKeyPairsForAccessKey = generateAKeyPairsForAccessKey;