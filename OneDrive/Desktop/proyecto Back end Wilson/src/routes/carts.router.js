import { Router } from "express";
import CartManagerMongo from "../dao/mongo/cartManager.mongo.js";

const cartsRouter = Router();
const cartManager = new CartManagerMongo();

cartsRouter.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.createCart();
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const carrito = await cartManager.getCartById(cid);
    res.json(carrito);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const carritoActualizado = await cartManager.addProductToCart(cid, pid, quantity || 1);
    res.json(carritoActualizado);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) throw new Error("Debe indicar la cantidad");

    const carritoActualizado = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.json(carritoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const productsArray = req.body; 
    const carritoActualizado = await cartManager.updateCartProducts(cid, productsArray);
    res.json(carritoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const carritoActualizado = await cartManager.deleteProductFromCart(cid, pid);
    res.json(carritoActualizado);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const carritoVacio = await cartManager.emptyCart(cid);
    res.json(carritoVacio);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default cartsRouter;
