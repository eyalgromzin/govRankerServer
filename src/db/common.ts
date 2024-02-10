exports.createCommonMethods = (app, db) => {
    app.get("/common/getAllPartyToGovernment", async (req, res) => {
        try {
            const sql = `select * from party_to_government`;
            const result = await db.query(sql);

            res.json({
                status: 200,
                success: true,
                data: result.rows,
            });
        } catch (err) {
            console.log("failed to get article4", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/common/getAllPartyMemberToParty", async (req, res) => {
        try {
            const sql = `select * from party_member_to_party`;
            const result = await db.query(sql);

            return res.json({
                status: 200,
                success: true,
                data: result.rows,
            });
        } catch (err) {
            console.log("failed to get article5", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/common/getAllPartyMemberToGovernment", async (req, res) => {
        try {
            const sql = `select * from party_member_to_government`;
            const result = await db.query(sql);

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
