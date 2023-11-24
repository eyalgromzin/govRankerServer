

exports.createGovernmentMethods = (app, db) => {
    app.post("/gov/update", (req, res) => {
        try {
            const { uuid, name, description, imageUrl } = req.body;

            console.log("updating government");

            const sql = `update government set name=${name}, name=${description}, name=${imageUrl} where uuid=${uuid}`;

            db.run(sql, (err) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                console.log(
                    "updated government",
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
            console.log("failed to update government", err);

            return res.json({
                status: 400,
                success: false,
                error: err,
            });
        }
    });

    app.post("/gov/createGovernment", (req, res) => {
        try {
            const uuidV4 = require('uuidv4');

            console.log("creating government ");

            const { name, description, imageUrl } = req.body;
            
            console.log('uuid', uuidV4.uuid())

            const sql = `INSERT INTO government (uuid, name, description, imageUrl) values (?, ?, ?, ?)`;

            const v4UUID = uuidV4.uuid()

            db.run(sql, [v4UUID, name, description, imageUrl], (err) => {
                if (err) {
                    return res.json({
                        status: 300,
                        success: false,
                        error: err,
                    });
                }

                console.log(
                    "created government",
                    v4UUID,
                    name,
                    description,
                    imageUrl
                );
            });

            return res.json({
                status: 200,
                success: true,
                res: { v4UUID, name, description, imageUrl }
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
};
