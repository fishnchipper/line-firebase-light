
let lineFirbase = require('../../line_modules/line-firebase');
let dbAdapter = lineFirbase.createDBAdapter();


function on(req, res, next) {
    console.log("++++ api ++++ {get} /app called");

    let user = req.decodedSession;

    dbAdapter.getDocumentsWithUserUID("applications", user.user_id)
    .then((docs) => {
        res.json({code: 'api.app.get', message:"app list is successfully returned.", payload:docs});
    })
    .catch((e) => {
        res.status(400).json({code: 'api.app.error', message:'app get error'});
    })
}

module.exports.on= on;