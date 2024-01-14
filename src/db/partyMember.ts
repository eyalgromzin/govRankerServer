export const getAllPartyMembers = async (db) => {
    const sql = `select * from party_member`;
    const result = await db.query(sql);

    return {
        status: 200,
        success: true,
        data: result.rows,
    };
}

exports.createPartyMemberMethods = (app, db) => {
    const createPartyMemberAndPartyConnectionInDB = async (
        res,
        partyMemberUUID: string,
        partyUUID: string
    ) => {
        const sql = `INSERT INTO party_member_to_party ("party_member_uuid", "party_uuid") values ($1, $2)`;

        const result = await db.query(sql, [partyMemberUUID, partyUUID]);

        console.log(
            "created party member to party",
            partyMemberUUID,
            partyUUID
        );

        return result;
    };

    app.post("/partyMember/updatePartyMember", async (req, res) => {
        try {
            const { uuid, name, description, imageUrl } = req.body;

            console.log("updating partyMember ");

            const sql = `update party_member set name='${name}', description='${description}', image_url='${imageUrl}' where entity_uuid=${uuid}`;

            const result = await db.query(sql);

            console.log(
                "updated partyMember",
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
            console.log("failed to update partyMember", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    const createPartyMemberInDB = async (
        res,
        name: any,
        description: any,
        imageUrl: any
    ) => {
        const uuidV4 = require("uuidv4");

        const uuid = uuidV4.uuid();

        const name2 = name.replace('\'', '\'\'')
        const description2 = description.replace('\'', '\'\'')

        const sql = `INSERT INTO party_member ("entity_uuid", "name", "description", "image_url") values ($1, '${name2}', '${description2}', '${imageUrl}')`;

        const result = await db.query(sql, [uuid]);

        console.log("created party member", uuid, name, description, imageUrl);
        return uuid;
    };

    app.post("/partyMember/createPartyMember", async (req, res) => {
        try {
            console.log("creating party ");

            const { name, description, imageUrl, partyUUID } = req.body;

            const newPartyMemberUUID = await createPartyMemberInDB(
                res,
                name,
                description,
                imageUrl
            );

            await createPartyMemberAndPartyConnectionInDB(
                res,
                newPartyMemberUUID,
                partyUUID
            );

            return res.json({
                status: 200,
                success: true,
                res: {
                    name,
                    description,
                    imageUrl,
                    partyUUID,
                    newPartyMemberUUID,
                },
            });
        } catch (err) {
            console.log("failed to create party member", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.get("/partyMember/getAllPartyMembers", async (req, res) => {
        try {
            return res.json(await getAllPartyMembers(db))
        } catch (err) {
            console.log("failed to get party member ", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/government/deletePartyMember", async (req, res) => {
        try {
            const uuidV4 = require("uuidv4");

            console.log("deleting party");

            const { partyMemberUUID } = req.body;

            console.log("uuid", uuidV4.uuid());

            await deletePartyMemberToParty(partyMemberUUID);
            
            await deletePartyMember(partyMemberUUID);

            return res.json({
                status: 200,
                success: true,
                res: { partyMemberUUID: partyMemberUUID },
            });
        } catch (err) {
            console.log("failed to create government", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }

        async function deletePartyMemberToParty(partyMemberUUID: any) {
            const sql = `DELETE FROM party_member_to_party WHERE party_member_uuid = $1`;

            const result = await db.query(sql, [partyMemberUUID]);

            console.log(
                `deleted partyMember to party with partyMemberUUID: ${partyMemberUUID}`,
                partyMemberUUID
            );
        }

        async function deletePartyMember(partyMemberUUID: any) {
            const sql = `DELETE FROM party_member WHERE entity_uuid = $1`;

            const result = await db.query(sql, [partyMemberUUID])

            console.log(`deleted party member ${partyMemberUUID}`, partyMemberUUID);
        }
    });
};
