const { createArticleMethods } = require('./db/article')
const { createGovernmentMethods } = require('./db/government')
const { createPartyMethods } = require('./db/party')
const { createPartyMemberMethods } = require('./db/partyMember')
const { createCommonMethods } = require('./db/common')
const { createLoginMethods } = require('./api/login')
const jwt = require("jsonwebtoken");

const cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, 'secret');
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    console.log(err)
  }
};

const validateCookie = (req, res, next) => {
  const {cookies} = req.headers
  if(cookies && cookies.includes('session_id')){
    console.log('with cookie ')
    console.log('cookies: ', cookies)
  }else{
    console.log('no cookie ')
  }
  next()
}

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
const cookieParser = require('cookie-parser');

require('dotenv').config();

// const sqlite = require('sqlite3').verbose()
// const db = new sqlite.Database( './src/gov.db' , sqlite.OPEN_READWRITE, err => {
//     if (err) console.error('SQLite connection error: ', err)
//     else console.log('Connected to sqlite3');
// })

const fs = require('fs');

const {Client} = require('pg')
const client = new Client({
  host: 'memshala.c92cmm8w8zbh.us-east-1.rds.amazonaws.com',
  user: 'eyalgromzin',
  password: 'dbPassword1!',
  port: 5432,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
})

client.connect()

client.query('select * from party', (err, res) => {
  if(!err){
    console.log(res.rows)
  }else{
    console.log(err.message)
  }

  client.end()
})

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(bodyParser.json());


var cors = require('cors');
app.use(cors({credentials: true, origin: 'http://localhost:4000'}));



app.get('/signIn2', validateCookie, (req, res) => {
  res.cookie('session_id', '1234');
  res.status(200).json({ msg: 'logged in' })
})

app.get('/', (req, res) => {
  console.log('/')
  res.send('Hello World32!')
})

app.post('/tokenTest', validateCookie, (req, res) => {
  console.log('testing cookie, look at the log')
})

createArticleMethods(app, client)
createGovernmentMethods(app, client)
createPartyMethods(app, client)
createPartyMemberMethods(app, client)
createCommonMethods(app, client)
createLoginMethods(app, client)


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

