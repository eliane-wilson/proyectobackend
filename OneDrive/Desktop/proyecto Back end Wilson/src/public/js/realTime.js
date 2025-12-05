const socket = io();

const form = document.getElementById("productForm");
const productsList = document.getElementById("productsList");


socket.on("productList", (products) => {
    renderProducts(products);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    if (!data.title || !data.description || !data.price || !data.code || !data.stock || !data.category) {
        alert("Todos los campos son obligatorios");
        return;
    }

    socket.emit("addProduct", data);

    form.reset();
});


function renderProducts(products) {
    productsList.innerHTML = ""; 

    products.forEach((p) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${p.title}</strong> - $${p.price} 
            <br>
            (Stock: ${p.stock})
            <br>
            Código: ${p.code}
            <br>
            Categoría: ${p.category}
        `;
        productsList.appendChild(li);
    });
}