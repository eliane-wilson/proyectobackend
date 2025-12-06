import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js"; 
import ProductManagerMongo from "./dao/mongo/productManager.mongo.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;

connectDB();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});

export const io = new Server(httpServer);

const productManager = new ProductManagerMongo();

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado por WebSocket");

    try {
        const products = await productManager.getProducts();
        socket.emit("productList", products.payload || products); 
    } catch (error) {
        socket.emit("productError", "No se pudieron cargar los productos");
    }
    socket.on("addProduct", async (productData) => {
        try {
            await productManager.addProduct(productData);
            const products = await productManager.getProducts();
            io.emit("productList", products.payload || products);
        } catch (error) {
            socket.emit("productError", error.message);
        }
    });
});
