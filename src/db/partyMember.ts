function createPartyMemberMethods(app: any) {
  app.post("/gov/createPartyMember", (req, res) => {
    try {
      console.log("creating government ");

      const { uuid, name, description, imageUrl } = req.body;

      const sql = `INSERT INTO government (uuid, name, description, imageUrl) values (?, ?, ?, ?)`;

      db.run(sql, [uuid, name, description, imageUrl], (err) => {
        if (err) {
          return res.json({ status: 300, success: false, error: err });
        }

        console.log("created government", uuid, name, description, imageUrl);
      });

      return res.json({
        status: 200,
        success: true,
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

  app.get("/gov/getAllPartyMembers", (req, res) => {
    try {
      const { partyId } = req.body;

      const sql = `select * from memberToParty where partyUUID = '${partyId}'`;

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
}
