

exports.createCommonMethods = (app, db) => {
    app.get("/common/getAllPartyToGovernment", (req, res) => {
        try {
            const sql = `select * from partyToGovernment`;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                if (rows < 1) {
                    res.json({
                        status: 300,
                        success: false,
                        error: "no rows matched",
                    });
                }

                res.json({
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

    app.get("/common/getAllPartyMemberToParty", (req, res) => {
        try {
            const sql = `select * from partyMemberToParty`;
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
