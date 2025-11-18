import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js";

const PORT = 8080;
const app = express();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


app.use(express.static("./src/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const httpServer= app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT}`)
);

export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado por WebSocket");
});
