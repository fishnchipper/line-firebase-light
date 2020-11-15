
const jwt = require('jsonwebtoken');


var error = {};
var accessToken = {
  token: "",
  verify: function() {
    return new Promise((resolve, reject) => {

      const kprofile = ___pkiKeyPairsForAccessKeyGen___.get('kprofile'); 
      //var decoded = jwt.decode(accessToken.token);
      //console.log("   kprofile: \n", kprofile);

      // verifying the OAuth2.0 access token issued 
      jwt.verify(
        accessToken.token,
        kprofile.publicKey,
        { algorithms: ['RS256']},
        (err, decoded) => {
          if(err) {
            console.log("   error: ", err);
            if(err.name == 'TokenExpiredError') {
              error.code = "session.token.fail.invalid";
              error.message = "invalid access token:expired";
            }else {
              error.code = "session.token.fail.invalid";
              error.message = "invalid access token";
            }
            
            reject(error);
          }else {
            console.log("   valid access token: \n", decoded);
            resolve(decoded);
          }
        }
      );

    });
  }
}

function _checkAccessToken(_headers) {

  return new Promise((resolve, reject) => {

    console.log("   req: ", _headers);
    var token = _headers['x-access-token'] || _headers['authorization']; // Express headers are auto converted to lowercase
  
    if (token) {
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        console.log("   token: ", token);
        accessToken.token = token;
        resolve(accessToken);
      }else {
        error.code = "session.token.fail.none";
        error.message = "no access token found";
        reject(error);
      }
    }else {
      error.code = "session.token.fail.none";
      error.message = "no access token found";
      reject(error);
    }
  });
}

function on(req, res, next) {

  console.log(">> checking session");

  _checkAccessToken(req.headers)
  .then((accessToken) => {
    return accessToken.verify();
  })
  .then((decoded)=> {
    // valid access token. go to next step
    req.decodedSession = decoded;
    next();
  })
  .catch((e)=>{
    console.log("   error: ", e);
    //res.status(400).json({'msg':'ale-ex.'});
    res.status(400).json({code: e.code, message:e.message});
  });
};

module.exports.on = on;
