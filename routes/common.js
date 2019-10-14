
let request = require('request');


/**
 * call get api of ALE
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} api 
 */
function callAleApiGet(req, res, api) {

    console.log(">>> get: ", api);

    try {
        // token with Bearer 
        let token = req.headers['authorization']; // Express headers are auto converted to lowercase

        request.get({
            "headers": { "content-type": "application/json" ,"Authorization": token },
            "url": api,
            "strictSSL": false, // for self-signed certificate
        }, (error, response, body) => {
            if(error) {
                console.log(">>>> ", error);
                res.json({
                    success: false,
                    code: 'error',
                    message: error.message,
                    payload: ''
                });
            }else {
                let _body = "";
                try {
                    _body = JSON.parse(body);
                }catch(e) {
                    console.log(">>>> ", e.name);
                    res.json({
                        success: false,
                        code: 'error',
                        message: e.message,
                        payload: ''
                    });
                    return;
                }
                console.log(">>>> ", _body);
                res.json({
                    success: _body['success'],
                    code: _body['code'],
                    message: _body['message'],
                    payload: _body['payload']              
                });
            }
        });

    } catch(e) 
    {
        console.log(">>> ", e.name);
        res.json({
            success: false,
            code: 'error',
            message: e.message,
            payload: ''
        });
    }

}

function callAleApiPost(req, res, api) {

    console.log(">>> post: ", api);

    try {

        // token with Bearer 
        let token = req.headers['authorization']; // Express headers are auto converted to lowercase

        let body = JSON.stringify(req.body);
        console.log(">>> body: ", body);

        request.post({
            "headers": { "content-type": "application/json" ,"Authorization": token },
            "url": api,
            "strictSSL": false, // for self-signed certificate
            "body": body
        }, (error, response, body) => {
            if(error) {
                console.log(">>>> ", error);
                res.json({
                    success: false,
                    code: 'communicationError',
                    message: error.code,
                    token: ''
                });
            }else {
                let _body = "";
                try {
                    _body = JSON.parse(body);
                }catch(e) {
                    console.log(">>>> ", e.name);
                    res.json({
                        success: false,
                        code: 'error',
                        message: e.message,
                        payload: ''
                    });
                    return;
                }
                console.log(">>>> ", _body);
                res.json({
                    success: _body['success'],
                    code: _body['code'],
                    message: _body['message'],
                    payload: _body['payload']              
                });
            }
        });

    } catch(e) 
    {
        console.log(">>> ", e.name);
        res.json({
            success: false,
            code: 'error',
            message: e.message,
            payload: ''
        });
    }
}


module.exports.callAleApiGet = callAleApiGet;
module.exports.callAleApiPost = callAleApiPost;