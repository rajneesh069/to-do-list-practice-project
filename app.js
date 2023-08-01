const date = require("./date.js");
const express = require("express");
const app = express();
const _ = require("lodash");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public/css"));
app.set("view engine", "ejs");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/listsDB");
const toDoListSchema = mongoose.Schema({
    name: String,
})
const toDoList = mongoose.model("toDoList", toDoListSchema);
app.get("/", (req, res) => {
    toDoList.find()
        .then((foundItems) => {
            const data = {
                title: "To Do List",
                listTitle: date.getDate(),
                items: foundItems,
            }
            res.render("list", data);
        })
})

app.post("/", (req, res) => {
    const item = req.body.item;
    const newItem = toDoList({
        name: item,
    });
    newItem.save()
        .then(() => {
            console.log("Saved Item successfully!");
            res.redirect("/");
        })
        .catch((error) => {
            console.log("Error saving the document", error);
        })
})

app.post("/delete", (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    toDoList.findByIdAndRemove({ _id: id })
        .then(() => {
            console.log("Deleted item successfully");
            res.redirect("/");
        })
        .catch((error) => {
            console.log("Error deleting the item", error);
        })
})

app.listen(3000, () => {
    console.log("Server is up and running!");
})