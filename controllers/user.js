const user           = require('../model/user');
const commonFunction = require('../handlers/common');
const sendResp       = require('../handlers/sendResponse');

const response = {};
module.exports = {
  async register(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;
    const requiredParam = ['name', 'email', 'password', 'confirmPass'];

    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 1;

      sendResp.sendResponse(response);
      return;
    }

    if(data.password !== data.confirmPass) {
      response.type = 'E';
      response.code = 2;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR USER ALREADY EXSITS OR NOT
    const isExists = await user.checkUser(data);
    if(isExists) {
      response.type = 'E';
      response.code = 3;

      sendResp.sendResponse(response);
      return;
    }

    //ALL SET CREATE USER
    try {
      const resp = await user.createUser(data);
      const resTxt    = { msg: "User created successfully", userId: resp.insertedIds[0] };
      response.type   = 'S';
      response.result = resTxt;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
      return;
    }
    catch (e) {
      response.type = 'E';
      response.code = 4;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    };
  },
  async login(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;
    const requiredParam = ['email', 'password'];

    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 1;

      sendResp.sendResponse(response);
      return;
    }

    try {
      //CHECK FOR USER ALREADY EXSITS OR NOT
      const userData = await user.checkUser(data);
      if(!userData) {
        response.type = 'E';
        response.code = 5;

        sendResp.sendResponse(response);
        return;
      } 

      //ALL SET NOW LOGIN 
      const resp = await user.login(data, userData);      
      
      response.type   = 'S';
      response.result = {token : resp};
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
    }
    catch(error) {
      response.type = 'E';
      response.code = 4;
      if (typeof error === 'number') {
        response.code = error;
      }

      sendResp.sendResponse(response);
      return;
    }
  },

  async getUserDetail(req, res, next) {
    try {
      response.res = res;
      const userEmail = req.data.email;
      const userData  = await user.getUserDetail(userEmail);
      response.type   = 'S';
      response.result = userData;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
    }
    catch(error) {
      response.type = 'E';
      response.code = 7;
      if (typeof error === 'number') {
        response.code = error;
      }

      sendResp.sendResponse(response);
      return;
    }
  }
};
