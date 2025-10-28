import { Router } from "express";
import CartManager from "../CartManager.js";

const router = Router();
const cartManager = new CartManager("./src/carrito.txt");

router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.createCart();
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el carrito");
  }
});

export { router };

