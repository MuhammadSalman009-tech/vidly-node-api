const errorMiddleware = require("./Middleware/error");
const config = require("config");
const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const genresRouter = require("./Routes/genres");
const customersRouter = require("./Routes/customers");
const usersRouter = require("./Routes/users");
const authRouter = require("./Routes/auth");
const returnsRouter = require("./Routes/returns");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey not defined.");
  process.exit(1);
}
//MongoDB connection
const db = config.get("db");
mongoose
  .connect(db)
  .then(() => console.log(`Connected to ${db}`))
  .catch((error) => console.log("Could not connect to database...", error));

const app = express();
app.use(express.json());

app.use("/api/genres", genresRouter);
app.use("/api/customers", customersRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/returns", returnsRouter);
app.use(errorMiddleware);
require("./prod")(app);
module.exports = app;
