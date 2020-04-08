

let express = require('express');
let router = express.Router();

let getAppList = require('./get-app');
let postAppCreate = require('./post-app');
let deleteApp = require('./delete-app');



/**
 * /app
 */
router.route('/')
      .get(getAppList.on)
      .post(postAppCreate.on)
      .delete(deleteApp.on);


// close session 
router.use(function(req, res) {
    res.status(404).redirect('/404');
});
  
  
  
module.exports.router = router;