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

    app.post("/gov/createParty", (req, res) => {
        try {
            console.log("creating government ");

            const { uuid, name, description, imageUrl } = req.body;

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
};
