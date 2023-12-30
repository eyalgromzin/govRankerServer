exports.createGovernmentMethods = (app, db) => {
    app.post("/government/update", async (req, res) => {
        try {
            const { uuid, name, description, imageUrl } = req.body;

            console.log("updating government");

            const sql = `update government set name=${name}, description=${description}, image_url=${imageUrl} where entity_uuid=${uuid}`;

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
            const uuidV4 = require("uuidv4").uuid();

            console.log("creating government ");

            const { name, description, imageUrl } = req.body;

            console.log("uuid", uuidV4);

            const name2 = name.replace(/['"]/g, '');
            const description2 = description.replace(/['"]/g, '');

            const sql = `INSERT INTO government ("entity_uuid", "name", "description", "image_url") values ($1, '${name2}', '${description2}', '${imageUrl}')`;

            await db.query(sql, [uuidV4]);

            console.log(
                "created government",
                uuidV4,
                name,
                description,
                imageUrl
            );

            return res.json({
                status: 200,
                success: true,
                res: { uuidV4, name, description, imageUrl },
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
            const sql = `DELETE FROM party_to_government WHERE government_uuid = $1`;

            await db.query(sql, [governmentUUID]);

            console.log(
                `deleted party to government ${governmentUUID}`,
                governmentUUID
            );
        }

        async function deleteGovernment(governmentUUID: any) {
            const sql = `DELETE FROM government WHERE entity_uuid = $1`;

            await db.query(sql, [governmentUUID]);

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
