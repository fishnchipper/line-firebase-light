/**
 * main routes
 */


function noResource(req, res) {
    let log = '[' + req.requestDateTime + '] no path - ' + req.url;
    console.log(log);

    res.status(400).json({'msg':'roa-handler.'});
}
module.exports.noResource = noResource;