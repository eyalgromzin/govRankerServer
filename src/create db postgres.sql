-- Table: rating_types
DROP TABLE IF EXISTS rating_types;

CREATE TABLE IF NOT EXISTS rating_types (
    id          SERIAL PRIMARY KEY,
    rating_name TEXT
);

-- Table: article
DROP TABLE IF EXISTS article;

CREATE TABLE IF NOT EXISTS article (
    entity_uuid    UUID PRIMARY KEY,
    url            VARCHAR(250) CHECK (LENGTH(url) <= 250),
    date           VARCHAR(10) CHECK (LENGTH(date) <= 10),
    description    TEXT CHECK (LENGTH(description) <= 5000),
    image_url      VARCHAR(250) CHECK (LENGTH(image_url) <= 250),
    rating         INTEGER,
    creation_date  DATE DEFAULT '2023-01-01'::DATE NOT NULL,
    title          TEXT,
    FOREIGN KEY (rating) REFERENCES rating_types (id)
);

-- Table: entity_type
DROP TABLE IF EXISTS entity_type;

CREATE TABLE IF NOT EXISTS entity_type (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) CHECK (LENGTH(name) <= 50)
);

-- Table: entity_to_article
DROP TABLE IF EXISTS entity_to_article;

CREATE TABLE IF NOT EXISTS entity_to_article (
    id            SERIAL PRIMARY KEY,
    entity_uuid   UUID,
    article_uuid  UUID,
    entity_type_id INTEGER,
    FOREIGN KEY (entity_type_id) REFERENCES entity_type (id)
);



-- Table: government
DROP TABLE IF EXISTS government;

CREATE TABLE IF NOT EXISTS government (
    entity_uuid   UUID PRIMARY KEY ,
    name          VARCHAR(50) CHECK (LENGTH(name) <= 50),
    description   TEXT CHECK (LENGTH(description) <= 5000),
    image_url     VARCHAR(250) CHECK (LENGTH(image_url) <= 250)
);

-- Table: party
DROP TABLE IF EXISTS party;

CREATE TABLE IF NOT EXISTS party (
    entity_uuid   UUID PRIMARY KEY,
    name          VARCHAR(50) CHECK (LENGTH(name) <= 50),
    description   TEXT CHECK (LENGTH(description) <= 5000),
    image_url     VARCHAR(250) CHECK (LENGTH(image_url) <= 250)
);

-- Table: party_member
DROP TABLE IF EXISTS party_member;

CREATE TABLE IF NOT EXISTS party_member (
    entity_uuid   UUID PRIMARY KEY,
    name          VARCHAR(50) CHECK (LENGTH(name) <= 50),
    description   TEXT CHECK (LENGTH(description) <= 5000),
    image_url     VARCHAR(250) CHECK (LENGTH(image_url) <= 250)
);

-- Table: party_headers
DROP TABLE IF EXISTS party_headers;

CREATE TABLE IF NOT EXISTS party_headers (
    id               SERIAL PRIMARY KEY,
    party_member_uuid UUID NOT NULL REFERENCES party_member (entity_uuid),
    party_uuid       UUID NOT NULL REFERENCES party (entity_uuid),
    government_uuid  UUID NOT NULL REFERENCES government (entity_uuid)
);



-- Table: party_member_to_head_of_party
DROP TABLE IF EXISTS party_member_to_head_of_party;

CREATE TABLE IF NOT EXISTS party_member_to_head_of_party (
    party_member_uuid UUID REFERENCES party_member (entity_uuid) NOT NULL,
    party_uuid        UUID REFERENCES party (entity_uuid) NOT NULL,
    government_uuid   UUID REFERENCES government (entity_uuid) NOT NULL
);

-- Table: party_member_to_party
DROP TABLE IF EXISTS party_member_to_party;

CREATE TABLE IF NOT EXISTS party_member_to_party (
    id               SERIAL PRIMARY KEY,
    party_member_uuid UUID REFERENCES party_member (entity_uuid),
    party_uuid        UUID REFERENCES party (entity_uuid),
    government_uuid   UUID REFERENCES government (entity_uuid),
    FOREIGN KEY (party_member_uuid) REFERENCES party_member (entity_uuid),
    FOREIGN KEY (party_uuid) REFERENCES party (entity_uuid)
);


-- Table: position
DROP TABLE IF EXISTS position;

CREATE TABLE IF NOT EXISTS position (
    id   SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255)
);

-- Table: party_member_to_position
DROP TABLE IF EXISTS party_member_to_position;

CREATE TABLE IF NOT EXISTS party_member_to_position (
    id               SERIAL PRIMARY KEY,
    party_member_uuid UUID REFERENCES party_member (entity_uuid) NOT NULL,
    government_uuid   UUID REFERENCES government (entity_uuid) NOT NULL,
    position_id       INTEGER REFERENCES position (id) NOT NULL
);

-- Table: party_to_government
DROP TABLE IF EXISTS party_to_government;

CREATE TABLE IF NOT EXISTS party_to_government (
    id               SERIAL PRIMARY KEY,
    party_uuid       UUID,
    government_uuid  UUID,
    FOREIGN KEY (party_uuid) REFERENCES party (entity_uuid),
    FOREIGN KEY (government_uuid) REFERENCES government (entity_uuid)
);


-- View: government_to_party_member
DROP VIEW IF EXISTS government_to_party_member;
CREATE VIEW IF NOT EXISTS government_to_party_member AS
    SELECT party_member.entity_uuid AS pm_uuid,
           government.entity_uuid AS gov_uuid
      FROM party_member,
           government,
           party_to_government,
           party_member_to_party,
           party
     WHERE party_member.entity_uuid = party_member_to_party.party_member_uuid AND 
           government.entity_uuid = party_to_government.government_uuid AND 
           party.entity_uuid = party_to_government.party_uuid;

DROP VIEW IF EXISTS party_member_to_government;
CREATE VIEW IF NOT EXISTS party_member_to_government AS
    SELECT party_member.entity_uuid AS pm_uuid,
           government.entity_uuid AS gov_uuid
      FROM party_member,
           government,
           party_to_government,
           party_member_to_party,
           party
     WHERE party_member.entity_uuid = party_member_to_party.party_member_uuid AND 
           government.entity_uuid = party_to_government.government_uuid AND 
           party.entity_uuid = party_to_government.party_uuid;
