--
-- File generated with SQLiteStudio v3.4.4 on Fri Dec 29 09:48:45 2023
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: article
DROP TABLE IF EXISTS article;

CREATE TABLE IF NOT EXISTS article (
    uuid         TEXT    PRIMARY KEY
                         CHECK (length(uuid) = 36),
    url          TEXT    CHECK (length(url) <= 250),
    date         TEXT    CHECK (length(date) <= 10),
    description  TEXT    CHECK (length(description) <= 5000),
    imageUrl     TEXT    CHECK (length(imageUrl) <= 250),
    rating       INTEGER,
    creationDate TEXT    NOT NULL
                         DEFAULT (20230101),
    title        TEXT,
    FOREIGN KEY (
        rating
    )
    REFERENCES ratingTypes (id) 
);


-- Table: entityToArticle
DROP TABLE IF EXISTS entityToArticle;

CREATE TABLE IF NOT EXISTS entityToArticle (
    id           INTEGER PRIMARY KEY,
    entityUUID   TEXT    CHECK (length(entityUUID) = 36),
    articleUUID  TEXT    CHECK (length(articleUUID) = 36),
    entityTypeId INTEGER,
    FOREIGN KEY (
        entityTypeId
    )
    REFERENCES entityType (id) 
);


-- Table: entityType
DROP TABLE IF EXISTS entityType;

CREATE TABLE IF NOT EXISTS entityType (
    id   INTEGER PRIMARY KEY,
    name TEXT    CHECK (length(name) <= 50) 
);


-- Table: government
DROP TABLE IF EXISTS government;

CREATE TABLE IF NOT EXISTS government (
    uuid        TEXT PRIMARY KEY
                     CHECK (length(uuid) = 36),
    name        TEXT CHECK (length(name) <= 50),
    description TEXT CHECK (length(description) <= 5000),
    imageUrl    TEXT CHECK (length(imageUrl) <= 250) 
);


-- Table: party
DROP TABLE IF EXISTS party;

CREATE TABLE IF NOT EXISTS party (
    uuid        TEXT PRIMARY KEY
                     CHECK (length(uuid) = 36),
    name        TEXT CHECK (length(name) <= 50),
    description TEXT CHECK (length(description) <= 5000),
    imageUrl    TEXT CHECK (length(imageUrl) <= 250) 
);


-- Table: partyHeaders
DROP TABLE IF EXISTS partyHeaders;

CREATE TABLE IF NOT EXISTS partyHeaders (
    id              INTEGER PRIMARY KEY
                            NOT NULL,
    partyMemberUUID TEXT    NOT NULL
                            REFERENCES partyMember (uuid),
    partyUUID       TEXT    REFERENCES party (uuid) 
                            NOT NULL,
    governmentUUID  TEXT    REFERENCES government (uuid) 
                            NOT NULL
);


-- Table: partyMember
DROP TABLE IF EXISTS partyMember;

CREATE TABLE IF NOT EXISTS partyMember (
    uuid        TEXT PRIMARY KEY
                     CHECK (length(uuid) = 36),
    name        TEXT CHECK (length(name) <= 50),
    description TEXT CHECK (length(description) <= 5000),
    imageUrl    TEXT CHECK (length(imageUrl) <= 250) 
);


-- Table: partyMemberToHeadOfParty
DROP TABLE IF EXISTS partyMemberToHeadOfParty;

CREATE TABLE IF NOT EXISTS partyMemberToHeadOfParty (
    partyMemberUUID TEXT REFERENCES partyMember (uuid) 
                         NOT NULL,
    partyUUID       TEXT REFERENCES party (uuid) 
                         NOT NULL,
    governmentUUID  TEXT REFERENCES government (uuid) 
                         NOT NULL
);


-- Table: partyMemberToParty
DROP TABLE IF EXISTS partyMemberToParty;

CREATE TABLE IF NOT EXISTS partyMemberToParty (
    id              INTEGER PRIMARY KEY,
    partyMemberUUID TEXT    REFERENCES partyMember (uuid),
    partyUUID       TEXT    REFERENCES party (uuid),
    governmentUUID  TEXT    REFERENCES government (uuid),
    FOREIGN KEY (
        partyMemberUUID
    )
    REFERENCES partyMember (uuid),
    FOREIGN KEY (
        partyUUID
    )
    REFERENCES party (uuid) 
);


-- Table: partyMemberToPosition
DROP TABLE IF EXISTS partyMemberToPosition;

CREATE TABLE IF NOT EXISTS partyMemberToPosition (
    id              INTEGER PRIMARY KEY,
    partyMemberUUID TEXT    REFERENCES partyMember (uuid) 
                            NOT NULL,
    governmentUUID  TEXT    REFERENCES government (uuid) 
                            NOT NULL,
    positionId      INTEGER REFERENCES position (id) 
                            NOT NULL
);


-- Table: partyToGovernment
DROP TABLE IF EXISTS partyToGovernment;

CREATE TABLE IF NOT EXISTS partyToGovernment (
    id             INTEGER PRIMARY KEY,
    partyUUID      TEXT    CHECK (length(partyUUID) = 36),
    governmentUUID TEXT    CHECK (length(governmentUUID) = 36),
    FOREIGN KEY (
        partyUUID
    )
    REFERENCES party (uuid),
    FOREIGN KEY (
        governmentUUID
    )
    REFERENCES government (uuid) 
);


-- Table: position
DROP TABLE IF EXISTS position;

CREATE TABLE IF NOT EXISTS position (
    id   NUMERIC PRIMARY KEY
                 NOT NULL,
    name TEXT
);


-- Table: ratingTypes
DROP TABLE IF EXISTS ratingTypes;

CREATE TABLE IF NOT EXISTS ratingTypes (
    id         INTEGER PRIMARY KEY,
    ratingName TEXT
);


-- View: governmentToPartyMember
DROP VIEW IF EXISTS governmentToPartyMember;
CREATE VIEW IF NOT EXISTS governmentToPartyMember AS
    SELECT partyMember.uuid AS pmUUID,
           government.uuid AS govUUID
      FROM partyMember,
           government,
           partyToGovernment,
           partyMemberToParty,
           party
     WHERE partyMember.uuid == partyMemberToParty.partyMemberUUID AND 
           government.uuid == partyToGovernment.governmentUUID AND 
           party.uuid == partyToGovernment.partyUUID;


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
