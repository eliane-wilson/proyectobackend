import { Router } from "express";
import CartManager from "../CartManager.js";

const cartsRouter = Router();
const cartManager = new CartManager("./src/data/carrito.json");

cartsRouter.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.createCart();
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error("Error de Carrito", error);
    res.status(500).send("Error al crear el carrito");
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const carrito = await cartManager.getCartById(cid);
    res.json(carrito.products);
  } catch (error) {
    res.status(404).json({ message: "Carrito no encontrado" });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const carritoActualizado = await cartManager.addProductToCart(cid, pid);
    res.json(carritoActualizado);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default cartsRouter;

