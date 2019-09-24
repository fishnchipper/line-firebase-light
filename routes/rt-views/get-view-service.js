



function getViewService(req, res, next) {
    
    let values = '';

    res.render('./views/service/index', values, function(err, html) {
        if(err) {
            console.log(err);
            res.status(err.status).end();
        }else {
            res.set('Content-Type', 'text/html');
            res.send(html);
        }
    });
}

module.exports.on= getViewService;