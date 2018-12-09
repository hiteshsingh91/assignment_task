const router  = require('express').Router();
const user    = require('../../controllers/user');
const jwt     = require('jsonwebtoken');

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/getUserDetail',
(req, res, next) => {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
      const options = {
        expiresIn: jwtTokenExpiry  
      };
      try {
        result = jwt.verify(token, (process.env.JWT_SECRET || jwtSecretKey), options);
        req.data = result;
        next();
      } catch (err) {
           result = { 
            error: `Authentication error. Token has been expired`,
            status: 401 
          };
          res.status(401).send(result);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401 
      };
      res.status(401).send(result);
    }
      }
, user.getUserDetail);

module.exports = router;
