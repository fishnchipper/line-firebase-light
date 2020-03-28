let express = require('express');
let router = express.Router();


router.use(function (req, res, next) {
    req.requestTime = new Date().toISOString();
    console.log("--- /xxx - request time: ", req.requestTime);
    next();
});

/**
 * @swagger
 * tags:
 *   name: XXX
 *   description: your defined api
 */

// add user-defined apis
/*
let getABC = require('./get-abc');
let postABC = require('./post-abc');
let putABC = require('./put-abc');
let deleteABC = require('./delete-abc');
router.route('/abc')
      .get(getABC.on)
      .post(postABC.on)
      .put(putABC.on)
      .delete(deleteABC.on);
*/

// end of user-defined apis

// 404 
router.use(function(req, res) {
    res.status(404).json({code: '404', message:'404 Not Found'});
});
  
  
  
module.exports.router = router;