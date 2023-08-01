const express = require("express");
const app = express();
const _ = require("lodash");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
const mongoose = require("mongoose");