const client = require("../dbConnection.js");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

module.exports = {
  getUser: (req, res) => {
    try {
      console.log("Get user");
      client.query(`Select * from users`, (err, result) => {
        if (err) {
          res.send({ error: err });
        }
        res.send(result.rows);
        console.log("Request Fulfiled Successfully");
      });
    } catch (error) {
      console.log(error);
    }
  },

  getUserById: (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      client.query(`Select * from users where id =${id}`, (err, result) => {
        if (err) {
          res.send({ error: err });
        }
        if (result.rows.length === 0 || !result?.rows) {
          res.status(404).json({ error: "User not found" });
        } else {
          res.json(result.rows[0]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  //   addUser: async (req, res) => {
  //     try {
  //       const { name, email, gender } = req.body;
  //       const query =
  //         "INSERT INTO users (name, email, gender) VALUES ($1, $2, $3) RETURNING *";
  //       const values = [name, email, gender];
  //       const result = await client.query(query, values);
  //       res.status(201).json(result.rows[0]);
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).json({ error: "Failed to create a user" });
  //     }
  //   },

  addUser: async (req, res) => {
    try {
      const { name, email, gender } = req.body;
      if (!name || !email || !gender) {
        res.status(401).json({ error: "All fields are required" });
      } else {
        const token = jwt.sign(
          { userEmail: email },
          process.env.JWT_SECRET_KEY,
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

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, gender } = req.body;
      const query =
        "UPDATE users SET name = $1, email = $2, gender = $3 WHERE id = $4 RETURNING *";
      const values = [name, email, gender, id];
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update the user" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const query = "DELETE FROM users WHERE id = $1 RETURNING *";
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete the user" });
    }
  },
};
