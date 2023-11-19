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

createArticleMethods(app)
createGovernmentMethods(app)
createPartyMethods(app)
createPartyMemberMethods(app)

app.listen(port, () => {
  return console.log(`Express is 22 listening at http://localhost:${port}`);
});


