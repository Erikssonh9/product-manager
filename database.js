const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "database", "products.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        sku TEXT NOT NULL,
        description TEXT NOT NULL
    )
`);

const productCount = db.prepare("SELECT COUNT(*) AS count FROM products").get();

if (productCount.count === 0) {
    const insertProduct = db.prepare(`
        INSERT INTO products (name, price, sku, description)
        VALUES (?, ?, ?, ?)
    `);

    insertProduct.run(
        "Black T-Shirt",
        199,
        "TSH-001",
        "Black T-Shirt"
    );

    insertProduct.run(
        "White T-Shirt",
        199,
        "TSH-002",
        "White T-Shirt"
    );

    insertProduct.run(
        "Blue Hoodie",
        499,
        "HOD-001",
        "Blue Hoodie"
    );
}

module.exports = db;