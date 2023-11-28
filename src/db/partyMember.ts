exports.createPartyMemberMethods = (app, db) => {
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

    app.post("/partyMember/createPartyMember", (req, res) => {
        try {
            const uuidV4 = require('uuidv4');

            console.log("creating partyMember ");

            const { name, description, imageUrl } = req.body;

            const uuid = uuidV4.uuid()

            const sql = `INSERT INTO partyMember (uuid, name, description, imageUrl) values (?, ?, ?, ?)`;

            db.run(sql, [uuid, name, description, imageUrl], (err) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                console.log(
                    "created partyMember",
                    uuid,
                    name,
                    description,
                    imageUrl
                );
            });

            return res.json({
                status: 200,
                success: true,
                res: { uuid, name, description, imageUrl }
            });
        } catch (err) {
            console.log("failed to create partyMember", err);

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
