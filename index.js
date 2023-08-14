// run `node index.js` in the terminal
// STEP 1: IMPORT ALL NECESSARY PACKAGES
const express = require("express");
const HTTP_SERVER = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// console.log(process.env)

// ENABLING ENVIRONMENT VARIABLE CONFIGS
require("dotenv").config();

// CONFIGURING CORS
HTTP_SERVER.use(cors());

// CONFIGURING BODY-PARSER
HTTP_SERVER.use(bodyParser.json());
// parse application/x-www-form-urlencoded
HTTP_SERVER.use(bodyParser.urlencoded({ extended: false }));

// INJECTING DATABSE CONNECTION
require("./Database/dbConfig");

// BASIC SERVER CONFIGS
const PORT = 5000;

HTTP_SERVER.listen(PORT, "0.0.0.0", (err) => {
  if (err) throw err;
  console.log(`Listening on PORT ${PORT}`);
});

// INJECTING API SERVER
HTTP_SERVER.use("/", require("./app"));
