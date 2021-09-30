const fs = require('fs')
const register = require('./utils/register')
const login = require('./utils/login')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const port = 3000

app.set('view engine','ejs')
app.use(expressLayouts)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

const folderPath = './data';
if(!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath)
}

const filePath = './data/users.json';
if(!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath,'[]','utf-8')
}

app.get('/', (req, res) => {
  res.render('home', {
    layout: 'layouts/main-layout'
  })
})

app.get('/register', (req,res) => {
  res.render('register',{
    layout: 'layouts/main-layout',
    message:''
  })
})

app.post('/register', (req, res) => {
  const { email, firstName, lastName, password, confirmPassword } = req.body;
  const result = register.registerAccount(email, firstName, lastName, password, confirmPassword)

  res.render(result[0].redirect, {
    layout: 'layouts/main-layout',
    message: result[0].message,
    messageClass: result[0].messageClass,
  })
})

app.get('/login' , (req, res) => {
  res.render('login',{
    layout: 'layouts/main-layout',
    message:''
  })
})

app.post('/login', (req,res) => {
  const { email, password } = req.body;
  const result = login.loginAccount(email,password)

  res.cookie('AuthToken', result[0].authToken_);

  res.render(result[0].redirect,{
    layout: 'layouts/main-layout',
    message:result[0].message,
    messageClass: result[0].messageClass
  })

})

app.get('/protected', (req, res) => {
  res.render('protected', {
    layout: 'layouts/main-layout'
  })
})

app.use('/', (req, res, next) => {
  res.status(404)
  res.send('<h1>404 Not Found</h1>')
  next()
})

app.listen(port, () => {
  console.log(`App Listening at http://localhost:${port}\n`)
})