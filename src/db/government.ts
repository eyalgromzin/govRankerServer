exports.createGovernmentMethods = (app, db) => {
    app.post("/government/update", async (req, res) => {
        try {
            const { uuid, name, description, imageUrl } = req.body;

            console.log("updating government");

            const sql = `update government set name=${name}, name=${description}, name=${imageUrl} where uuid=${uuid}`;

            await db.query(sql);

            console.log(
                "updated government",
                uuid,
                name,
                description,
                imageUrl
            );

            return res.json({
                status: 200,
                success: true,
            });
        } catch (err) {
            console.log("failed to update government", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/government/createGovernment", async (req, res) => {
        try {
            const uuidV4 = require("uuidv4");

            console.log("creating government ");

            const { name, description, imageUrl } = req.body;

            console.log("uuid", uuidV4.uuid());

            const sql = `INSERT INTO government (uuid, name, description, imageUrl) values ('${uuidV4}', '${name}', '${description}', '${imageUrl})'`;

            const v4UUID = uuidV4.uuid();

            await db.run(sql);

            console.log(
                "created government",
                v4UUID,
                name,
                description,
                imageUrl
            );

            return res.json({
                status: 200,
                success: true,
                res: { v4UUID, name, description, imageUrl },
            });
        } catch (err) {
            console.log("failed to create government", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/government/deleteGovernment", async (req, res) => {
        try {
            const uuidV4 = require("uuidv4");

            console.log("creating government ");

            const { governmentUUID } = req.body;

            console.log("uuid", uuidV4.uuid());

            await deleteGovernment(governmentUUID);

            await deletePartyToGovernment(governmentUUID);

            return res.json({
                status: 200,
                success: true,
                res: { governmentUUID },
            });
        } catch (err) {
            console.log("failed to create government", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }

        async function deletePartyToGovernment(governmentUUID: any) {
            const sql = `DELETE FROM partyToGovernment WHERE governmentUUID = ?`;

            await db.run(sql);

            console.log(
                `deleted party to government ${governmentUUID}`,
                governmentUUID
            );
        }

        function deleteGovernment(governmentUUID: any) {
            const sql = `DELETE FROM government WHERE uuid = ?`;

            db.run(sql);

            console.log(`deleted Government ${governmentUUID}`, governmentUUID);
        }
    });

    app.get("/government/getAllGovernments",async (req, res) => {
        try {
            const sql = `select * from government`;
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
};
