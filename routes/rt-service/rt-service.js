

let express = require('express');
let router = express.Router();

let getServiceMain = require('./get-service-main');
let getUserProfile = require('./get-user-profile');



/**
 * get /service 
 */
router.get('/', getServiceMain.on);

/**
 * get /user/profile 
 */
router.get('/user/profile', getUserProfile.on);


// close session 
router.use(function(req, res) {
    res.status(404).redirect('/404');
});
  
  
  
module.exports.router = router;