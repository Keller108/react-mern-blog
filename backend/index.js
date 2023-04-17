import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(5000, (err) => {
    if (err) {
        console.log("Error", err);
    }

    console.log("Server OK");
});