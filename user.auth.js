const client = require("./dbConnection");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

module.exports = {
  addUser: async (req, res) => {
    try {
      const { name, email, gender } = req.body;
      if (!name || !email || !gender) {
        res.status(401).json({ error: "All fields are required" });
      } else {
        const token = jwt.sign(
          { userEmail: email },
          "jd897#$%dsjY*%#ldEddwmQ" || process.env.JWT_SECRET_KEY,
          { expiresIn: "2d" }
        );

        console.log("Token:--", token);

        res.setHeader("Authorization", `Bearer ${token}`);

        const query =
          "INSERT INTO users (name, email, gender) VALUES ($1, $2, $3) RETURNING *";
        const values = [name, email, gender];
        const result = await client.query(query, values);

        res.status(201).send({
          status: "success",
          message: "Created Success",
          token: token,
          data: { user: result?.rows[0] },
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create a user" });
    }
  },

  // /----------< Authentification>  ------------------

  authenticateUser: async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];

    // Check if the Authorization header exists and starts with 'Bearer '
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      // Extract the token (remove 'Bearer ' from the beginning)
      try {
        const token = authorizationHeader.slice(7);

        // Check if a token is provided
        if (!token) {
          return res
            .status(401)
            .json({ message: "Authentication token is missing." });
        } else {
          const decode = jwt.verify(
            token,
            "jd897#$%dsjY*%#ldEddwmQ" || process.env.JWT_SECRET_KEY
          );

          const userEmail = decode.userEmail;
          console.log("email", userEmail);
          // req.userId = userId;
          // client.connect();
          client.query(
            "SELECT * FROM users WHERE email = $1",
            [userEmail], // Use an array to pass parameters securely
            (err, result) => {
              if (err) {
                console.log(err);
                res.send({ error: "Invalid Token" });
              } else if (result.rows.length === 0) {
                res.status(401).json({ error: "Invalid token" });
              } else {
                console.log("User authenticated");
                next();
              }
            }
          );
        }
      } catch (error) {
        return res.status(401).json({
          status: "fail",
          error: error.message,
        });
      }
    } else {
      res.status(401).json({
        status: "fail",
        message: "Authentication token is missing.",
      });
    }
  },
};
