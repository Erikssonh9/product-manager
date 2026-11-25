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

app.post("/api/products", (req, res) => {
    const { name, price, sku, description } = req.body;

    const insertProduct = db.prepare(`
        INSERT INTO products (name, price, sku, description)
        VALUES (?, ?, ?, ?)
    `);

    const result = insertProduct.run(name, price, sku, description);

    const newProduct = db.prepare(`
        SELECT * FROM products WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(newProduct);
});

app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const result = db.prepare(
        "DELETE FROM products WHERE id = ?"
    ).run(id);

    

    if (result.changes === 0) {
        return res.sendStatus(404);
    }

    res.sendStatus(204);
});

app.put("/api/products/:id", (req, res) => { //tar emot uppdateringsförfrågan//
    const id = req.params.id;

    const { name, price, sku, description } = req.body;

    const result = db.prepare(`
        UPDATE products
        SET name = ?, price = ?, sku = ?, description = ?
        WHERE id = ?
    `).run(name, price, sku, description, id);

    if (result.changes === 0) {
        return res.sendStatus(404);
    }

    const updatedProduct = db.prepare(
        "SELECT * FROM products WHERE id = ?"
    ).get(id);

    res.json(updatedProduct);
});

app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
});