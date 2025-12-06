import { Router } from "express";
import ProductManagerMongo from "../dao/mongo/productManager.mongo.js";

const router = Router();
const productManager = new ProductManagerMongo();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const products = await productManager.getProducts({ limit, page, sort, query });
    res.json({ status: "success", payload: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await productManager.updateProduct(pid, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.deleteProduct(pid);
    res.json({ message: "Producto eliminado", deletedProduct });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
