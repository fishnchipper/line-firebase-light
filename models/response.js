/**
 * @swagger
 *  components:
 *    schemas:
 *      Response:
 *        type: object
 *        required:
 *          - code
 *          - message
 *        properties:
 *          code:
 *            type: string
 *          message:
 *            type: string
 *            description: a short description of the code.
 *          payload:
 *            type: object
 *            description: a json object if any.
 */
module.exports.Response = {
    code:"",
    message:"",
    paylod: {}
}
