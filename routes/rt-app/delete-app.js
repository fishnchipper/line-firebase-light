let lineFirbase = require('../../line_modules/line-firebase');
let dbAdapter = lineFirbase.createDBAdapter();

function on(req, res, next) {

    console.log("++++ api ++++ {delete} /app/:appid called");

    let appId = req.params.appid;
    console.log("++++ api ++++ :appid: ", appId);
    if(!appId) {
        res.status(400).json({code: 'api.app.error', message:'app remove error'});
    }else {
        dbAdapter.deleteDocument('applications', appId)
        .then((result) => {
            console.log("++++ result: ", result);
            res.json({code: 'api.app.method', message:"successfully removed", payload:{__id: appId}});
        })
        .catch((e)=>{
            console.log("++++ error: ", e);
            res.status(400).json({code: 'api.app.error', message:'delete error'});  
        })
    }
}

module.exports.on= on;