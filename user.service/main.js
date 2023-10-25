const client = require("./dbConnection");
const express = require("express");
const app = express();

//----controllers----
const userController = require("./controllers/user.controller");

//----middleware-------
const userAuth = require("./middleware/user.auth");

app.use(express.json());

// start node server
app.listen(7000, () => {
  console.log("Sever is now listening at port 7000");
});

//DB connection
client.connect((err, client, done) => {
  if (err) {
    console.error("Error durring DB connection", err);
    return res.status(500).json({ error: "Error durring DB Connection" });
  }
  if (client) {
    console.log(
      `Connection estblished with "${client?.database}" on Port ${client?.port}`
    );
  }
});

// *************ROUTES***************************

//-----Public routes------
app.post("/user", userAuth.addUser);

//--------globle auth user middlware-------
app.use(userAuth.authenticateUser);

//-----restricted routes------

// get all user
app.get("/users", userController.getUser);
// get user by id
app.get("/user/:id", userController.getUserById);
// update user
app.put("/user/:id", userController.updateUser);
// delete user
app.delete("/user/:id", userController.deleteUser);
