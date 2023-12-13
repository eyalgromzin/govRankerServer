import { jwtSecret } from "../env2";

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createLoginMethods = (app, db) => {
    app.post("/login", async (req, res) => {
        try {
            const { username, password } = req.body;

            // const user = await getUser(username);
            if (username != "admin" || password != "admin") {
                return res.status(403).json({
                    error: "invalid login",
                });
            }

            const user = { username, password };

            const token = jwt.sign(user, jwtSecret, {
                expiresIn: "1h",
            });

            res.cookie("token2", token);
            res.cookie("token", token, {
                httpOnly: true,
            });

            return res.status(200).json({
                data: {
                    status: 200,
                    token: token,
                    success: true,
                },
                error: undefined
            });
        } catch (e) {
            console.log("failed in login reoute: ", e);
        }
    });
};
