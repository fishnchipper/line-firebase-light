

/**
 * Check the inclusion of token from a client before accessing ale
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkToken(req, res, next) {

  console.log(">>>> req: ", req.headers);
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
      console.log(">>>> token: ", token);
    }
    next();
  } else {
    return res.status(404).render('./no-session', function(err, html) {
      if(err) {
          console.log(err);
          res.status(err.status).end();
      }else {
          res.set('Content-Type', 'text/html');
          res.send(html);
      }
    });
  }
};

module.exports.checkToken = checkToken;
