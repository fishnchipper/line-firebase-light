

let express = require('express');
let router = express.Router();

let getServiceMain = require('./get-service-main');
let getServiceSub = require('./get-service-page');



/**
 * get /service 
 */
router.get('/', getServiceMain.on);

/**
 * get /service/page 
 */
router.get('/page', getServiceSub.on);


// close session 
router.use(function(req, res) {
    res.status(404).redirect('/404');
});
  
  
  
module.exports.router = router;