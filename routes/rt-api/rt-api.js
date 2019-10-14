let express = require('express');
let router = express.Router();




// close session 
router.use(function(req, res) {
    res.json({error:'IncorrectAPI'});
    res.status(404).end();
});
  
  
  
module.exports.router = router;