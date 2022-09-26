///////////////////////////////
// DEPENDENCIES
////////////////////////////////

// get .env variables
require("dotenv").config();

// pull PORT from .env, give default value of 4000
const { PORT = 4000, MONGODB_URL } = process.env;

// import express
const express = require("express");

//create application object
const app = express();

// import mongoose
const mongoose = require("mongoose");

// import middleware
const cors = require('cors');
const morgan = require('morgan');

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////

// Establish Connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const PeopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String
});

const People = mongoose.model("People", PeopleSchema);
///////////////////////////////
// MIDDLEWARE
////////////////////////////////
//prevent cors errors, open access to all origins
app.use(cors());

//logging
app.use(morgan("dev"));

// parse json bodies
app.use(express.json());

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});

// PEOPLE INDEX ROUTE
app.get("/people", async (req, res) => {
  try {
    //send all people
    res.json(await People.find({}));
  } catch (error) {
    // send error
    res.status(400).json(error);
  }
});

// PEOPLE CREATE ROUTE
app.post("/people", async (req, res) => {
  try {
    // send all people
    res.json(await People.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PEOPLE DELETE ROUTE
app.delete("/people/:id", async (req, res) => {
  try {
    // send all people
    res.json(await People.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PEOPLE UPDATE ROUTE
app.put("/people/:id", async (req, res) => {
  try {
    // send all people
    res.json(
      await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error code 400
    res.status(400).json(error);
  }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
