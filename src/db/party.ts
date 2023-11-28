exports.createPartyMethods = (app, db) => {
    app.post("/party/update", (req, res) => {
        try {
            const { uuid, name, description, imageUrl } = req.body;

            console.log("updating partyMember");

            const sql = `update party set name=${name}, name=${description}, name=${imageUrl} where uuid=${uuid}`;

            db.run(sql, (err) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                console.log("updated party", uuid, name, description, imageUrl);
            });

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

    app.post("/party/createParty", (req, res) => {
        try {
            const uuidV4 = require('uuidv4');

            console.log("creating party ");

            const { name, description, imageUrl } = req.body;

            const uuid = uuidV4.uuid()

            const sql = `INSERT INTO party (uuid, name, description, imageUrl) values (?, ?, ?, ?)`;

            db.run(sql, [uuid, name, description, imageUrl], (err) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                console.log("created party", uuid, name, description, imageUrl);
            });

            return res.json({
                status: 200,
                success: true,
                res: { uuid, name, description, imageUrl }
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

    app.get("/party/getAllParties", (req, res) => {
        try {
            const sql = `select * from party`;
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
