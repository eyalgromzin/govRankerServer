const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database(
    "C:/my projects/govRanker/gove-ranker-server/src/gov.db",
    sqlite.OPEN_READWRITE,
    (err) => {
        if (err) return console.error(err);

        console.log("connected to db");
    }
);

// const sql01 = 'drop table ratingTypes'
// const sql02 = 'drop table articles'
// const sql03 = 'drop table party'
// const sql04 = 'drop table partyMember'
// const sql05 = 'drop table entityToArticle'

// db.run(sql01)
// db.run(sql02)
// db.run(sql03)
// db.run(sql04)
// db.run(sql05)

// const sql1 = `CREATE TABLE ratingTypes (
//   id INTEGER PRIMARY KEY,
//   ratingName TEXT
// ); `

// db.run(sql1)

// set id as string - and as primary key
// will always be as UTC + 0. eg 20050412 = y: 2005, m: 04 d:12
// const sql2 = `CREATE TABLE articles (
//     uuid TEXT PRIMARY KEY CHECK (length(uuid) = 36),
//     url TEXT CHECK (length(url) <= 250),
//     date TEXT CHECK (length(date) <= 10),
//     description TEXT CHECK (length(description) <= 500),
//     imageUrl TEXT CHECK (length(imageUrl) <= 250),
//     rating INTEGER,
//     FOREIGN KEY(rating) REFERENCES ratingTypes(id)
//   ); `

// db.run(sql2)

// const sql30 = `CREATE TABLE entityType (
//     id INTEGER PRIMARY KEY, 
//     name TEXT CHECK (length(name) <= 50)
// ); `;

// db.run(sql30);

// const sql3 = `CREATE TABLE entityToArticle (
//     id INTEGER PRIMARY KEY,
//     entityUUID TEXT CHECK (length(entityUUID) = 36),
//     articleUUID TEXT CHECK (length(articleUUID) = 36),
//     entityType INTEGER,
//     FOREIGN KEY(entityType) REFERENCES entityType(id)
//   ); `

// db.run(sql3)

// const sql4 = `CREATE TABLE government (
//     uuid TEXT PRIMARY KEY CHECK (length(uuid) = 36),
//     name TEXT CHECK (length(name) <= 50),
//     description TEXT CHECK (length(description) <= 500),
//     imageUrl TEXT CHECK (length(imageUrl) <= 250)
//   ); `

//   db.run(sql4)

// const sql5 = `CREATE TABLE party (
//     uuid TEXT PRIMARY KEY CHECK (length(uuid) = 36),
//     name TEXT CHECK (length(name) <= 50),
//     description TEXT CHECK (length(description) <= 500),
//     imageUrl TEXT CHECK (length(imageUrl) <= 250)
//   ); `

//   db.run(sql5)

// const sql6 = `CREATE TABLE partyMember (
//     uuid TEXT PRIMARY KEY CHECK (length(uuid) = 36),
//     name TEXT CHECK (length(name) <= 50),
//     description TEXT CHECK (length(description) <= 500),
//     imageUrl TEXT CHECK (length(imageUrl) <= 250)
//   ); `

//   db.run(sql6)

// const sql7 = `CREATE TABLE partyToGovernment (
//     id INTEGER PRIMARY KEY,
//     partyUUID TEXT CHECK (length(partyUUID) = 36),
//     governmentUUID TEXT CHECK (length(governmentUUID) = 36),
//     FOREIGN KEY(partyUUID) REFERENCES party(uuid),
//     FOREIGN KEY(governmentUUID) REFERENCES government(uuid)
//   ); `

// db.run(sql7)

// const sql8 = `CREATE TABLE memberToParty (
//     id INTEGER PRIMARY KEY,
//     memberUUID TEXT CHECK (length(memberUUID) = 36),
//     partyUUID TEXT CHECK (length(partyUUID) = 36),
//     FOREIGN KEY(memberUUID) REFERENCES partyMember(uuid)
//     FOREIGN KEY(partyUUID) REFERENCES party(uuid)
//   ); `

// need to create view of goverment to member , and member to government

// db.run(sql8)
