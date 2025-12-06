import { CartModel } from "../../models/cart.model.js";

export default class CartManagerMongo {

  async getCarts() {
    return await CartModel.find().populate("products.product").lean();
  }

  async getCartById(cid) {
    const cart = await CartModel.findById(cid).populate("products.product").lean();
    if (!cart) throw new Error("Carrito no encontrado");
    return cart;
  }

  async createCart() {
    const newCart = await CartModel.create({ products: [] });
    return newCart.toObject();
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const existingProduct = cart.products.find(p => p.product.toString() === pid);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    return await cart.populate("products.product").execPopulate();
  }

  async updateCartProducts(cid, productsArray) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = productsArray.map(p => ({ product: p.product, quantity: p.quantity }));
    await cart.save();
    return await cart.populate("products.product").execPopulate();
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const existingProduct = cart.products.find(p => p.product.toString() === pid);
    if (!existingProduct) throw new Error("Producto no encontrado en el carrito");

    existingProduct.quantity = quantity;
    await cart.save();
    return await cart.populate("products.product").execPopulate();
  }

  async deleteProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return await cart.populate("products.product").execPopulate();
  }

  async emptyCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    await cart.save();
    return cart;
  }
}
