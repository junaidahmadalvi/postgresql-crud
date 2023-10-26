const client = require("../../dbConnection");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
const UserService = require("../user.service");
const userServicesec = new UserService();

module.exports = {
  getUser: async (req, res) => {
    try {
      console.log("Get user");
      const users = await userServicesec.getUsers();
      console.log("users:", users);
      if (users) return res.status(201).send(users);
      //   client.query(`Select * from users`, (err, result) => {
      //     if (err) {
      //       res.send({ error: err });
      //     }
      //     res.send(result.rows);
      //     console.log("Request Fulfiled Successfully");
      // });
    } catch (error) {
      console.log(error);
    }
  },

  getUserById: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const user = await userServicesec.getUser(id);
      console.log("user:", user);
      if (user) return res.status(201).send(user);
      // client.query(`Select * from users where id =${id}`, (err, result) => {
      //   if (err) {
      //     res.send({ error: err });
      //   }
      //   if (result.rows.length === 0 || !result?.rows) {
      //     res.status(404).json({ error: "User not found" });
      //   } else {
      //     res.json(result.rows[0]);
      //   }
      // });
    } catch (error) {
      console.log(error);
    }
  },

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
      const userBody = req?.body;
      userBody.id = id;
      const { name, email, gender } = req.body;
      if (!name || !email || !gender) {
        res.status(401).json({ error: "All fields are required" });
      } else {
        const updatedUser = await userServicesec.updateUser(userBody);
        console.log("updatedUser", updatedUser);
        if (updatedUser) {
          res.status(401).json(updatedUser);
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update the user" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await userServicesec.deleteUser(id);
      // console.log("user:", user);
      if (deletedUser) return res.status(201).send(deletedUser);

      // const query = "DELETE FROM users WHERE id = $1 RETURNING *";
      // const result = await client.query(query, [id]);
      // if (result.rows.length === 0) {
      //   res.status(404).json({ error: "User not found" });
      // } else {
      //   res.json(result.rows[0]);
      // }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete the user" });
    }
  },
};
