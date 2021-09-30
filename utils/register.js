const fs = require('fs')
const crypto = require('crypto')

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

const registerAccount = (email, firstName, lastName, password, confirmPassword) => {
    
  const users = fs.readFileSync('./data/users.json','utf-8');
  const users_ = JSON.parse(users);
  
  if (password === confirmPassword) {

    if (users_.find(user => user.email === email)) {

      const result = [
        {
          redirect : 'register',
          message: 'User already registered.',
          messageClass: 'alert-danger',
        }
      ]

      return result;

    }

    const hashedPassword = getHashedPassword(password);

    users_.push({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    fs.writeFileSync('data/users.json',JSON.stringify(users_))

    const result_ = [
      {
        redirect : 'login',
        message: 'Registration Complete. Please login to continue.',
        messageClass: 'alert-success',
      }
    ]

    return result_;

  } else {
  
    const result_ = [
        {
            redirect : 'register',
            message: 'Password does not match.',
            messageClass: 'alert-danger',
        }
    ]

    return result_;
  }
}


module.exports = {
  registerAccount
}
