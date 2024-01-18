import { runCrawler } from './crawler'
import {getDomain} from '../utils'

const uuidV4 = require("uuidv4");

export const getRecentlyAdded = async (db, numOfArticles) => {
    const sql = `select * from article order by creation_date limit ${
        numOfArticles + ""
    }`;

    const result = await db.query(sql);

    return {
        status: 200,
        success: true,
        data: result.rows,
    }
}

exports.createArticleMethods = (app, db) => {

    // this is article for everyone
    app.post("/article/createArticle", async (req, res) => {
        try {
            const { entityUUID, title, url, date, description, imageUrl, rating } = req.body;

            return await createArticle(db, title, url, date, description, imageUrl, rating);
        } catch (err) {
            console.log("failed to create article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/article/crawlYnet", async (req, res) => {
        try {
            const url = 'https://www.ynet.co.il/news/article/yokra13763496'
            console.log(`crawling url ${url}`);

            const {maxDepth} = req.body;

            // runCrawler('https://www.ynet.co.il/home/0,7340,L-8,00.html', maxDepth)
            const domain = getDomain('https://www.ynet.co.il/home/0,7340,L-8,00.html')
            runCrawler(db, url, 1, domain)  //maxDepth

            return res.json({
                status: 200,
                success: true,
                res: {},
            });
        } catch (err) {
            console.log("failed to crawl ynet", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/article/updateArticle", async (req, res) => {
        try {
            console.log("updateing article");

            const { uuid, title, url, date, description, imageUrl, rating } =
                req.body;

            const sql = `update article set url='${url}', date='${date}', description='${description}', image_url='${imageUrl}', rating=${rating}, title='${title}' where entity_uuid='${uuid}'`;

            await db.query(sql);

            return res.json({
                status: 200,
                success: true,
                res: {
                    uuid,
                    title,
                    url,
                    date,
                    description,
                    imageUrl,
                    rating,
                },
            });
        } catch (err) {
            console.log("failed to update article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/article/createEntityArticle", async (req, res) => {
        try {
            console.log("creating entity to article");

            const { entityUUID, articleUUID, entityTypeId } = req.body;

            const uuid = uuidV4.uuid();

            const sql = `INSERT INTO entity_to_article ("entity_uuid", "article_uuid", entity_type_id) values ($1, '${articleUUID}', ${entityTypeId})`;

            const result = await db.query(sql, [uuid]);

            console.log(
                "added article",
                entityUUID,
                articleUUID,
                entityTypeId
            );

            return res.json({
                status: 200,
                success: true,
                res: { uuid, entityUUID, articleUUID, entityTypeId },
            });
        } catch (err) {
            console.log("failed to create entity to article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/article/connectArticle", async (req, res) => {
        try {
            console.log("connecting article");

            const { entityUUID, articleUUID, entityTypeId } = req.body;

            const sql = `INSERT INTO entity_to_article ("entity_uuid", "article_uuid", "entity_type_id") values ($1, $2, ${entityTypeId})`;

            const result = await db.query(sql, [entityUUID, articleUUID]);

            return res.json({
                status: 200,
                success: true,
                res: result.rows,
            });
        } catch (err) {
            console.log("failed to connect article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/article/getEntityArticles", async (req, res) => {
        try {
            const { entityUUID, fromDate, toDate } = req.body;
            const sql = `select * from articles where entity_uuid in (select entity_uuid from entity_to_article where entity_uuid = "${entityUUID}" ) and date > "${fromDate}" and date < "${toDate}" `;
            const results = await db.query(sql);

            return res.json({
                status: 200,
                success: true,
                data: results.rows,
            });
        } catch (err) {
            console.log("failed to get article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/article/getGovernmentArticles", async (req, res) => {
        try {
            const governmentUUID = req.query.governmentUUID;

            const sql = `select * from article where entity_uuid in (
                    select article_uuid from entity_to_article where entity_uuid in 
                    (select pm_uuid from government_to_party_member where gov_uuid='${governmentUUID}')
                )`;
            const result = await db.query(sql);

            return res.json({
                status: 200,
                success: true,
                data: result.rows,
            });
        } catch (err) {
            console.log("failed to get government article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/article/getPartyArticles", async (req, res) => {
        try {
            const partyUUID = req.query.partyUUID;

            const sql = `select * from article where entity_uuid in (
                select article_uuid from entity_to_article where entity_uuid in 
                (select party_member_uuid from party_member_to_party where party_uuid='${partyUUID}'))`;

            const result = await db.query(sql);

            return res.json({
                status: 200,
                success: true,
                data: result.rows,
            });
        } catch (err) {
            console.log("failed to get government article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/article/getPartyMemberArticles", async (req, res) => {
        try {
            const partyMemberUUID = req.query.partyMemberUUID;

            const sql = `select * from article where entity_uuid in (select article_uuid from entity_to_article where entity_uuid = $1)`;

            const result = await db.query(sql, [partyMemberUUID]);

            return res.json({
                status: 200,
                success: true,
                data: result.rows,
            });
        } catch (err) {
            console.log("failed to get government article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/article/getAllArticles", async (req, res) => {
        try {
            const sql = `select * from article`;
            const results = await db.query(sql);
            return res.json({
                status: 200,
                success: true,
                data: results.rows,
            });
        } catch (err) {
            console.log("failed to get article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/article/getRecentlyAdded", async (req, res) => {
        try {
            const numOfArticles = req.query.numOfArticles;
            
            return res.json(await getRecentlyAdded(db, numOfArticles))
        } catch (err) {
            console.log("failed to get article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/article/deleteArticle", (req, res) => {
        try {
            console.log("deleting article ");

            const { articleUUID } = req.body;

            console.log("uuid", uuidV4.uuid());

            deleteArticle(articleUUID);

            deleteEntityToArticle(articleUUID);

            return res.json({
                status: 200,
                success: true,
                res: { governmentUUID: articleUUID },
            });
        } catch (err) {
            console.log("failed to create government", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }

        async function deleteEntityToArticle(articleUUID: any) {
            const sql = `DELETE FROM entity_to_article WHERE article_uuid = '${articleUUID}'`;

            db.query(sql);

            console.log(`deleted entity to article ${articleUUID}`);
        }

        async function deleteArticle(articleUUID: string) {
            const sql = `DELETE FROM article WHERE entity_uuid = ${articleUUID}`;

            await db.query(sql);

            console.log(`deleted article ${articleUUID}`);
        }
    });
};
export const createArticle = async (db, title, url, date, description, imageUrl, rating) => {
    console.log("creating article");

    const now = new Date();
    const creationDate = `${now.getFullYear()}${now.getMonth()}${now.getDay()}`;

    const uuid = uuidV4.uuid();

    const title2 = title.replace('\'', '\'\'');
    const description2 = description.replace('\'', '\'\'');

    const sql = `INSERT INTO article ("entity_uuid", "url", "date", "description", "image_url", "rating", "title", "creation_date") values ($1, '${url}', '${date}', '${description2}', '${imageUrl}', ${rating}, '${title2}', '${creationDate}')`;

    const result = await db.query(sql, [uuid]);

    console.log(
        "added article",
        uuid,
        url,
        date,
        description,
        imageUrl,
        rating,
        title,
        creationDate
    );

    return {
        status: 200,
        success: true,
        res: {
            uuid,
            url,
            date,
            description,
            imageUrl,
            rating,
            title,
            creationDate,
        },
    }
}

