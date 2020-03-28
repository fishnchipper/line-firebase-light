

let express = require('express');
let router = express.Router();

let getServiceMain = require('./get-service-main');
let getUserProfile = require('./get-user-profile');



/**
 * /service 
 */
router.route('/')
      .get(getServiceMain.on);

/**
 * /service/user/profile 
 */
router.route('/user/profile')
      .get(getUserProfile.on);


// close session 
router.use(function(req, res) {
    res.status(404).redirect('/404');
});
  
  
  
module.exports.router = router;