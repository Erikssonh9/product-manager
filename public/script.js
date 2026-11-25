// Hämtar produkterna från backend
async function hamtaProdukter() {
    try {
        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Kunde inte hämta produkterna.");
        }

        const products = await response.json();

        visaProdukter(products);

    } catch (error) {
        document.querySelector("#message").textContent =
            "Ett fel uppstod när produkterna skulle hämtas.";
        console.error(error);
    }
}


// Visar produkterna i tabellen
function visaProdukter(products) {
    const tableBody = document.querySelector("#products-table-body");

    tableBody.textContent = "";

    products.forEach(product => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const skuCell = document.createElement("td");
        skuCell.textContent = product.sku;

        const priceCell = document.createElement("td");
        priceCell.textContent = product.price;

        const deleteCell = document.createElement("td");

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.setAttribute("aria-label", "Radera produkt");

        // Raderar produkten när användaren klickar
        deleteButton.addEventListener("click", async () => {
            const confirmDelete = confirm(
                "Är du säker på att du vill radera produkten?"
            );

            if (!confirmDelete) {
                return;
            }

            try {
                const response = await fetch(`/api/products/${product.id}`, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    throw new Error("Kunde inte radera produkten.");
                }

                await hamtaProdukter();

                document.querySelector("#message").textContent =
                    "Produkten har raderats!";

            } catch (error) {
                document.querySelector("#message").textContent =
                    "Ett fel uppstod när produkten skulle raderas.";

                console.error(error);
            }
        });

        deleteCell.appendChild(deleteButton);

        row.appendChild(nameCell);
        row.appendChild(skuCell);
        row.appendChild(priceCell);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
    });
}

// Hämtar produkterna när sidan öppnas
hamtaProdukter();

const productForm = document.querySelector("#product-form");

productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newProduct = {
        name: document.querySelector("#name").value,
        price: Number(document.querySelector("#price").value),
        sku: document.querySelector("#sku").value,
        description: document.querySelector("#description").value
    };

    try {
    const response = await fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
    });

    if (!response.ok) {
        throw new Error("Kunde inte spara produkten.");
    }

    const savedProduct = await response.json();

    console.log("Produkten har sparats:", savedProduct);

    hamtaProdukter();

    productForm.reset();

    document.querySelector("#message").textContent =
        "Produkten har lagts till!";

} catch (error) {
    document.querySelector("#message").textContent =
        "Ett fel uppstod när produkten skulle sparas.";

    console.error(error);
}
});