let express = require('express');
let router = express.Router();
let putAuthApp = require('./put-app');


/**
 * /auth/app
 */
router.route('/app')
      .put(putAuthApp.on);


// close session 
router.use(function(req, res) {
    res.status(404).redirect('/404');
});
  
  
  
module.exports.router = router;