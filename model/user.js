const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const saltRounds = 10;

module.exports = {
  async checkUser(data) {
    const checkQuery =  { $or: [{email: data.email}, {_id : objectID(data.userId) }]  };

    const response = await mongoClient.collection(userDB).findOne(checkQuery);

    return await response;
  },

  async createUser(data) {

    const insertParam = {
      email    : data.email,
      name     : data.name,
      password : await bcrypt.hash(data.password, saltRounds),
      createdOn: new Date()
    };

    let resp = await mongoClient.collection(userDB).insert(insertParam);

    return await resp;
  },

  async login(params, userData) {
    try {
      //CHECK FOR PASSWORD MATCHES WITH DB PASS
      const isAuthencated = await bcrypt.compare(params.password, userData.password);
      if(!isAuthencated) {
        throw 6;
      }

      //CREATE USER TOKEN
      const payload = { userName: userData.name, email : userData.email };
      const options = { expiresIn: '30000'};
      const secret = process.env.JWT_SECRET || 'mysecretkey';
      const token = jwt.sign(payload, secret, options);
      
      return token;
    }
    catch(error) {
      throw error;
    }
  },

  async getUserDetail(email) {
    try {
      const checkQuery =  {email: email};

      const response = await mongoClient.collection(userDB).findOne(checkQuery, {name: 1, email: 1, _id: 1 });
  
      return await response;
    }
    catch(error) {
      throw error;
    }
  }
};

