

let express = require('express');
let router = express.Router();

let getApp = require('./get-app-id');
let getAppList = require('./get-app');
let postAppCreate = require('./post-app');
let deleteApp = require('./delete-app');



/**
 * /app
 */
router.route('/:appid')
      // get an app by :appid
      .get(getApp.on)
      // delete an app by :appid
      .delete(deleteApp.on);
router.route('/')
      // get the app list
      .get(getAppList.on)
      // add a new app
      .post(postAppCreate.on);



// close session 
router.use(function(req, res) {
    res.status(404).redirect('/404');
});
  
  
  
module.exports.router = router;