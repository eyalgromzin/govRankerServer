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

app.get('/test2', (req, res) => {
  console.log('test2')
  res.send('test 322')
});

app.post('/addArticle', (req, res) => {
  try{
    console.log('adding article ')

    const { uuid, url, date, description, imageUrl, rating } = req.body

    const sql = `INSERT INTO articles (uuid, url, date, description, imageUrl, rating) values (?, ?, ?, ?, ?, ?)` 
    
    db.run(sql, [uuid, url, date, description, imageUrl, rating], (err) => {
      if (err){
        return res.json({status: 300, success: false, error: err})
      }

      console.log('added article', uuid, url, date, description, imageUrl, rating)
    })

    return res.json({
      status: 200,
      success: true
    })
  }catch(err){
    console.log('failed to add article', err)

    return res.json({
      status: 400,
      success: false,
      error: err
    })
  }
});


app.get('/getAllArticles', (req, res) => {
  try{
    const sql = `select * from articles` 
    db.all(sql, [], (err, rows) => {
      if (err){
        return res.json({
          status: 300,
          success: false,
          error: err
        })
      }

      if (rows < 1){
        return res.json({
          status: 300,
          success: false,
          error: 'no rows matched'
        })
      }

      return res.json({
        status: 200,
        success: true,
        data: rows,
      })


    })  
  }catch(err){
    console.log('failed to get article', err)

    return res.json({
      status: 400,
      success: false,
      error: err
    })
  }
})


app.listen(port, () => {
  return console.log(`Express is 22 listening at http://localhost:${port}`);
});
