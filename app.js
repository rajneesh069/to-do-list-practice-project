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
});
const customListSchema = mongoose.Schema({
    listName: String,
    items: [toDoListSchema],
});
const toDoList = mongoose.model("toDoList", toDoListSchema);
const customList = mongoose.model("customList", customListSchema);
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
    const listName = req.body.button;
    const item = req.body.item;
    const newItem = toDoList({
        name: item,
    });
    if (listName === date.getDate()) {
        newItem.save()
            .then(() => {
                console.log("Saved Item successfully!");
                res.redirect("/");
            })
            .catch((error) => {
                console.log("Error saving the document", error);
            })
    } else {
        customList.findOneAndUpdate({ listName: listName }, { $push: { items: [newItem] } })
            .then(() => {
                res.redirect("/" + listName);
            })
            .catch((error) => {
                console.log("Error adding new item to the custom list:", error);
            })
    }
})

app.post("/delete", (req, res) => {
    const id = req.body.id;
    const listName = req.body.listTitle;
    if (listName === date.getDate()) {
        toDoList.findByIdAndRemove({ _id: id })
            .then(() => {
                console.log("Deleted item successfully");
                res.redirect("/");
            })
            .catch((error) => {
                console.log("Error deleting the item", error);
            })
    } else {
        customList.findOneAndUpdate({ listName: listName }, { $pull: { items: { _id: id } } })
            .then(() => {
                console.log("Deleted item successfully");
                res.redirect("/" + listName);

            })
            .catch((error) => {
                console.log("Error deleting the custom list item", error);
            })
    }

})

app.get("/:listName", (req, res) => {
    const listName = _.capitalize(req.params.listName);
    customList.findOne({ listName: listName })
        .then((foundList) => {
            if (foundList) {
                console.log("Entered if!")
                console.log(foundList);
                const data = {
                    title: listName,
                    listTitle: listName,
                    items: foundList.items,
                };
                res.render("list", data);
            } else {
                const newCustomList = customList({
                    listName: listName,
                    items: [],
                })
                newCustomList.save()
                    .then((savedList) => {
                        const data = {
                            title: listName,
                            listTitle: listName,
                            items: savedList.items,
                        }
                        res.render("list", data);
                    })
                    .catch((error) => {
                        console.log("Error creating new custom list:", error);
                    })

            }

        })
        .catch((error) => {
            console.log("Error rendering custom list :", error);
        })
})

app.listen(3000, () => {
    console.log("Server is up and running!");
})