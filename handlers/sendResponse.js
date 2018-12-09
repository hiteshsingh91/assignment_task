
const errMsg = [];

const commonMsg = [];
commonMsg[1] = 'Required field not passed';
commonMsg[2] = commonMsg[2];
commonMsg[3] = 'Unable to process request. Please try again later.';
commonMsg[4] = 'No such user found aginst particular Id.';


errMsg[1] = commonMsg[1];
errMsg[2] = commonMsg[2];
errMsg[3] = 'User is already created with same email.';
errMsg[4] = commonMsg[3];
errMsg[5] = commonMsg[4];
errMsg[6] = 'username/password does not match';
errMsg[7] = commonMsg[3];

module.exports = {
  sendResponse(data) {

    //ERROR REQUEST
    if (data.type === 'E') {
      data.res.status(400).json({ msg: errMsg[data.code], code : data.code });
      return;
    }

    data.res.status(200).json(data.result);
    return;
  }
};
