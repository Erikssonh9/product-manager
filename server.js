const express = require("express");
const db = require("./database");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(express.static("public"));

app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();

    res.json(products);
});

app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
});