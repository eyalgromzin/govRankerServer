exports.createCommonMethods = (app, db) => {
    app.get("/common/getAllPartyToGovernment", async (req, res) => {
        try {
            const sql = `select * from partyToGovernment`;
            const result = await db.query(sql);

            res.json({
                status: 200,
                success: true,
                data: result.rows,
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

    app.get("/common/getAllPartyMemberToParty", async (req, res) => {
        try {
            const sql = `select * from partyMemberToParty`;
            const result = await db.query(sql);

            return res.json({
                status: 200,
                success: true,
                data: result.rows,
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

    app.get("/common/getAllPartyMemberToGovernment", async (req, res) => {
        try {
            const sql = `select * from partyMemberToGovernment`;
            const result = db.query(sql);

            return res.json({
                status: 200,
                success: true,
                data: result.rows,
            });
        } catch (err) {
            console.log("failed to get gov party members", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });
};
