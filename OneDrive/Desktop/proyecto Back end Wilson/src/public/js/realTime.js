const socket = io();

const productsList = document.getElementById("productsList");

socket.on("productsUpdated", (products) => {
    renderProducts(products);
});

function renderProducts(products) {
    productsList.innerHTML = ""; // Limpiar lista

    products.forEach((p) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${p.title}</strong> - $${p.price} (Stock: ${p.stock})
        `;
        productsList.appendChild(li);
    });
}