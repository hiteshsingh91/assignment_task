const jwt = require('jsonwebtoken');

module.exports = {
  checkEmptyValue(data, requiredData) {
    for(var i = 0; i < requiredData.length; i++) {
      if(!data.hasOwnProperty(requiredData[i]) || !data[requiredData[i]] || (Array.isArray(data[requiredData[i]]) &&  data[requiredData[i]].length <= 0 ) ) {
        return false;
      }
    }
    return true;
  },

  validateToken: async(req, res, next) => {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
      const options = {
        expiresIn: jwtTokenExpiry  
      };
      try {
        result = jwt.verify(token, (process.env.JWT_SECRET || jwtSecretKey), options);
        req.decoded = result;
        next();
      } catch (err) {
        throw new Error(err);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401 
      };
      res.status(401).send(result);
    }
  }
};

