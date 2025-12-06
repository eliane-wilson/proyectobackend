import { Router } from "express";
import { getProductsView, getProductByIdView, getCartView } from "../controllers/views.controller.js";

const router = Router();

router.get("/products", getProductsView);
router.get("/products/:pid", getProductByIdView);
router.get("/carts/:cid", getCartView);

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts"); 
});

export default router;

