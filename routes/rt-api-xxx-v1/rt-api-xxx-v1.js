let express = require('express');
let router = express.Router();


// user-defined apis
//


//
// end of user-defined apis

// 404 
router.use(function(req, res) {
    res.status(400).json({'msg':'roa-handler.'});
});
  
  
  
module.exports.router = router;