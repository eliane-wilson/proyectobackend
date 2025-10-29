import { Router } from "express";
import CartManager from "../CartManager.js";

const cartsRouter = Router();
const cartManager = new CartManager("./src/carrito.txt");

cartsRouter.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.createCart();
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error("Error de Carrito", error);
    res.status(500).send("Error al crear el carrito");
  }
});

export default cartsRouter;

