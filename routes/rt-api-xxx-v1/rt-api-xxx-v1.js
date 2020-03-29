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
*/
/**
 * @swagger
 * path:
 *  /path1:
 *    delete:
 *      summary: End session token assigned to {uuid}
 *      tags: [XXX]
 *      parameters:
 *      - name: uuid
 *        in: path
 *        description: uuid of client
 *        schema:
 *          type: string
 *      responses:
 *        "200":
 *          description: Session cleared
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Response'
 *              example:
 *                code: session.end
 *                message: session cleared
 *        "400":
 *          description: Invalid request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Response'
 *              examples:
 *                invalid uuid:
 *                   code: session.error
 *                   message: invalid uuid
 *                no session linked:
 *                   code: session.error
 *                   message: session does not exist
 */
/*
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