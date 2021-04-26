const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
const URL = require("./models/shortURL");

mongoose
    .connect(process.env.db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("db connection success"))
    .catch((err) => console.log(err));

// middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// routes
app.get("/", async (req, res) => {
    const urls = await URL.find();
    res.render("index", { urls: urls });
});

app.post("/short", async (req, res) => {
    try {        
        await URL.create({ full: req.body.fullURL });
        res.redirect("/");
    }
    catch (err) {
        console.log(err);
    }
});

app.get("/:shortURL", async (req, res) => {
    const shortURL = await URL.findOne({ short: req.params.shortURL });
    if (shortURL == null) return res.sendStatus(404);

    shortURL.clicks++;
    shortURL.save();

    res.redirect(shortURL.full);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server running on PORT " + PORT));
