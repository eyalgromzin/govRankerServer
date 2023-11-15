const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('C:/my projects/govRanker/gove-ranker-server/src/gov.db', sqlite.OPEN_READWRITE, err => {
    if (err) return console.error(err)
    
    console.log('connected to db')
})

// set id as string - and as primary key
//will always be as UTC + 0. eg 20050412 = y: 2005, m: 04 d:12
const sql = `CREATE TABLE articles (
    uuid TEXT PRIMARY KEY CHECK (length(uuid) = 36),
    url TEXT CHECK (length(url) <= 250),
    date TEXT CHECK (length(date) <= 10),   
    description TEXT CHECK (length(description) <= 500),
    imageUrl TEXT CHECK (length(imageUrl) <= 250),
    rating INTEGER 
  ); `

db.run(sql)

