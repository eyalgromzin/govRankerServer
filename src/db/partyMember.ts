exports.createPartyMemberMethods = (app, db) => {
    const createPartyMemberAndPartyConnectionInDB = async (res, partyMemberUUID: string, partyUUID: string) => {
        const sql = `INSERT INTO partyMemberToParty (partyMemberUUID, partyUUID) values (?, ?)`;
    
        const result = await db.run(sql, [partyMemberUUID, partyUUID], (err) => {
            if (err) {
                return res.json({
                    status: 300,
                    success: false,
                    error: err,
                });
            }
    
            console.log("created party member to party", partyMemberUUID, partyUUID);
        });
    
        return result;
    }

    app.post("/partyMember/updatePartyMember", (req, res) => {
        try {
            const { uuid, name, description, imageUrl } = req.body;

            console.log("updating partyMember ");

            const sql = `update partyMember set name=${name}, name=${description}, name=${imageUrl} where uuid=${uuid}`;

            db.run(sql, (err) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                console.log(
                    "updated partyMember",
                    uuid,
                    name,
                    description,
                    imageUrl
                );
            });

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

    const createPartyMemberInDB = (res, name: any, description: any, imageUrl: any) => {
        const uuidV4 = require('uuidv4');

        const uuid = uuidV4.uuid();
    
        const sql = `INSERT INTO partyMember (uuid, name, description, imageUrl) values (?, ?, ?, ?)`;
    
        db.run(sql, [uuid, name, description, imageUrl], (err) => {
            if (err) {
                return res.json({
                    status: 300,
                    success: false,
                    error: err,
                });
            }
    
            console.log("created party member", uuid, name, description, imageUrl);
        });
        return uuid;
    }

    app.post("/partyMember/createPartyMember", (req, res) => {
        try {

            console.log("creating party ");

            const { name, description, imageUrl, partyUUID } = req.body;

            const newPartyMemberUUID = createPartyMemberInDB(res, name, description, imageUrl);

            createPartyMemberAndPartyConnectionInDB(res, newPartyMemberUUID, partyUUID) 

            return res.json({
                status: 200,
                success: true,
                res: { name, description, imageUrl, partyUUID, newPartyMemberUUID }
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

    app.get("/partyMember/getAllPartyMembers", (req, res) => {
        try {
            const sql = `select * from partyMember`;
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
