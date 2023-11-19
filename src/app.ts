const articleFile = require('./db/article')
const { createArticleMethods } = articleFile
const govFile = require('./db/government')
const { createGovernmentMethods } = govFile
const partyFile = require('./db/party')
const { createPartyMethods } = partyFile
const partyMembersFile = require('./db/partyMember')
const { createPartyMemberMethods } = partyMembersFile


const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 

const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database( 'C:/my projects/govRanker/gove-ranker-server/src/gov.db' , sqlite.OPEN_READWRITE, err => {
    if (err) console.error('SQLite connection error: ', err)
    else console.log('Connected to sqlite3');
})

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

var cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  console.log('/')
  res.send('Hello World32!')
})

createArticleMethods(app, db)
createGovernmentMethods(app, db)
createPartyMethods(app, db)
createPartyMemberMethods(app, db)

app.listen(port, () => {
  return console.log(`Express is 22 listening at http://localhost:${port}`);
});


