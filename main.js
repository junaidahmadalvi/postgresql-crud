const client = require("./dbConnection");
const express = require("express");
const app = express();

//----controllers----
const userController = require("./user.service/controllers/user.controller");

//----middleware-------
const userAuth = require("./middleware/user.auth");

// require routes
const userRoutes = require("./user.service/user.routes");
app.use(express.json());

// start node server
app.listen(7000, () => {
  console.log("Sever is now listening at port 7000");
});

//DB connection
// client.connect((err, client, done) => {
//   if (err) {
//     console.error("Error durring DB connection", err);
//     return res.status(500).json({ error: "Error durring DB Connection" });
//   }
//   if (client) {
//     console.log(
//       `Connection estblished with "${client?.database}" on Port ${client?.port}`
//     );
//   }
// });

// *************ROUTES***************************

//-----Public routes------
app.post("/auth/user", userAuth.addUser);

//--------globle auth user middlware-------
app.use(userAuth.authenticateUser);

//-----restricted routes------

app.use("/api/user", userRoutes);
