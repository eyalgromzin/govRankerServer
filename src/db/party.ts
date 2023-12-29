const uuidV4 = require("uuidv4");

exports.createPartyMethods = (app, db) => {
    const createPartyAndGovernmentConnectionInDB = async (
        res,
        partyUUID: string,
        governmentUUID: string
    ) => {
        const sql = `INSERT INTO partyToGovernment (party_uuid, government_uuid) values ($1, $2)`;

        const result = await db.query(sql, [partyUUID, governmentUUID]);

        console.log("created party to government", partyUUID, governmentUUID);

        return result;
    };

    const createPartyInDB = async (
        res,
        name: any,
        description: any,
        imageUrl: any
    ) => {
        const uuid = uuidV4.uuid();

        const sql = `INSERT INTO party (entity_uuid, name, description, imageUrl) values ($1, ${name}, ${description}, ${imageUrl})`;

        const result = await db.query(sql, [uuid]);

        console.log("created party", uuid, name, description, imageUrl);

        return uuid;
    };

    app.post("/party/update", async (req, res) => {
        try {
            const { uuid, name, description, imageUrl } = req.body;

            console.log("updating partyMember");

            const sql = `update party set name=${name}, description=${description}, image_url=${imageUrl} where entity_uuid=${uuid}`;

            const result = await db.query(sql);

            console.log("updated party", uuid, name, description, imageUrl);

            return res.json({
                status: 200,
                success: true,
            });
        } catch (err) {
            console.log("failed to create party", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/party/createParty", async (req, res) => {
        try {
            console.log("creating party ");

            const { name, description, imageUrl, govUUID } = req.body;

            const newPartyUUID = await createPartyInDB(
                res,
                name,
                description,
                imageUrl
            );

            createPartyAndGovernmentConnectionInDB(res, newPartyUUID, govUUID);

            return res.json({
                status: 200,
                success: true,
                res: { name, description, imageUrl, govUUID, newPartyUUID },
            });
        } catch (err) {
            console.log("failed to create party", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/party/getAllParties", async (req, res) => {
        try {
            const sql = `select * from party`;
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

    app.post("/government/deleteParty", (req, res) => {
        try {
            const uuidV4 = require("uuidv4");

            console.log("deleting party");

            const { partyUUID } = req.body;

            console.log("uuid", uuidV4.uuid());

            deleteParty(partyUUID);

            deletePartyToGovernment(partyUUID);

            return res.json({
                status: 200,
                success: true,
                res: { partyUUID },
            });
        } catch (err) {
            console.log("failed to create government", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }

        async function deletePartyToGovernment(partyUUID: any) {
            const sql = `DELETE FROM party_to_government WHERE party_uuid = ?`;

            const result = await db.query(sql)

            console.log(
                `deleted party to government ${partyUUID}`,
                partyUUID
            );
        }

        async function deleteParty(partyUUID: any) {
            const sql = `DELETE FROM party WHERE entity_uuid = ?`;

            const result = await db.query(sql)

            console.log(`deleted party ${partyUUID}`, partyUUID);
        }
    });
};
