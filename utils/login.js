const fs = require('fs')
const crypto = require('crypto')

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

const loginAccount = (email, password) => {

    const hashedPassword = getHashedPassword(password);
    const users = fs.readFileSync('./data/users.json','utf-8')
    const users_ = JSON.parse(users);

    const user = users_.find(u => {
        return u.email === email && hashedPassword === u.password
    });

    if (user) {
        const authToken = generateAuthToken();

        authTokens[authToken] = user;

        const result = [
          {
            redirect: 'protected',
            authToken_ : authToken,
          }
        ]

        return result;

    } else {

        const result = [
          {
            redirect: 'login',
            message: 'Invalid username or password',
            messageClass: 'alert-danger',
          }
        ]

        return result;
    }
}

module.exports = {
  loginAccount
}
