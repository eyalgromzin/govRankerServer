exports.createArticleMethods = (app, db) => {
    // this is article for everyone
    app.post("/addArticle", (req, res) => {
        try {
            console.log("adding article ");

            const { uuid, url, date, description, imageUrl, rating } = req.body;

            const sql = `INSERT INTO articles (uuid, url, date, description, imageUrl, rating) values (?, ?, ?, ?, ?, ?)`;

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
                }
            );

            return res.json({
                status: 200,
                success: true,
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

    app.get("/getAllEntityArticles", (req, res) => {
        try {
            const { uuid } = req.body;
            const sql = `select * from articles where uui in (select * from entityToArticle where entityUUID = ${uuid} ) `;
            db.all(sql, [], (err, rows) => {
                if (err) {
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

    app.get("/getAllArticles", (req, res) => {
        try {
            const sql = `select * from articles`;
            db.all(sql, [], (err, rows) => {
                if (err) {
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
};