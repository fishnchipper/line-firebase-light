

let express = require('express');
let router = express.Router();


let getViewService = require('./get-view-service');
let getViewServicePage = require('./get-view-service-page');


/**
 * get /service view 
 */
router.get('/', getViewService.on);

/**
 * get /service/page view 
 */
router.get('/page', getViewServicePage.on);



// close session 
router.use(function(req, res) {
    res.json({error:'IncorrectAPI'});
    res.status(404).end();
});
  
  
  
module.exports.router = router;