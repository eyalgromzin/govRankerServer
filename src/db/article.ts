exports.createArticleMethods = (app, db) => {
    const uuidV4 = require("uuidv4");

    // this is article for everyone
    app.post("/article/createArticle", (req, res) => {
        try {
            console.log("creating article");

            const { url, date, description, imageUrl, rating } = req.body;

            const sql = `INSERT INTO article (uuid, url, date, description, imageUrl, rating) values (?, ?, ?, ?, ?, ?)`;

            const uuid = uuidV4.uuid();

            db.run(
                sql,
                [uuid, url, date, description, imageUrl, rating],
                (err) => {
                    if (err) {
                        return res.json({
                            status: 300,
                            success: false,
                            error: err,
                        });
                    }

                    console.log(
                        "added article",
                        uuid,
                        url,
                        date,
                        description,
                        imageUrl,
                        rating
                    );

                    return res.json({
                        status: 200,
                        success: true,
                        res: { uuid, url, date, description, imageUrl, rating },
                    });
                }
            );
        } catch (err) {
            console.log("failed to add article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/article/createEntityArticle", (req, res) => {
        try {
            console.log("creating entity to article");

            const { entityUUID, articleUUID, entityTypeId } = req.body;

            const sql = `INSERT INTO entityToArticle (entityUUID, articleUUID, entityTypeId) values (?, ?, ?)`;

            const uuid = uuidV4.uuid();

            db.run(sql, [entityUUID, articleUUID, entityTypeId], (err) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

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
            });
        } catch (err) {
            console.log("failed to add article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/article/connectArticle", (req, res) => {
        try {
            console.log("connecting article");

            const { entityId, articleId, entityTypeId } = req.body;

            const sql = `INSERT INTO entityToArticle (entityUUID, articleUUID, entityTypeId) values (?, ?, ?)`;

            db.run(sql, [entityId, articleId, entityTypeId], (err) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                console.log("connected article", entityId, articleId);
            });

            return res.json({
                status: 200,
                success: true,
                res: { entityId, articleId, entityTypeId },
            });
        } catch (err) {
            console.log("failed to add article", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/article/getEntityArticles", (req, res) => {
        try {
            const { entityUUID, fromDate, toDate } = req.body;
            const sql = `select * from articles where uuid in (select articleUUID from entityToArticle where entityUUID = "${entityUUID}" ) and date > "${fromDate}" and date < "${toDate}" `;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error(err);
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                if (rows < 1) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: "no rows matched",
                    });
                }

                return res.json({
                    status: 200,
                    success: true,
                    data: rows,
                });
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

    app.get("/article/getAllArticles", (req, res) => {
        try {
            const sql = `select * from article`;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                return res.json({
                    status: 200,
                    success: true,
                    data: rows,
                });
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

    app.post("/article/deleteArticle", (req, res) => {
        try {
            const uuidV4 = require("uuidv4");

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

        function deleteEntityToArticle(articleUUID: any) {
            const sql = `DELETE FROM entityToArticle WHERE articleUUID = ?`;

            db.run(sql, [articleUUID], (err) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                console.log(
                    `deleted entity to article ${articleUUID}`,
                    articleUUID
                );
            });
        }

        function deleteArticle(articleUUID: string) {
            const sql = `DELETE FROM article WHERE uuid = ?`;

            db.run(sql, [articleUUID], (err) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                console.log(`deleted article ${articleUUID}`);
            });
        }
    });
};
