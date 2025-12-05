import fs from "fs/promises";
import path from "path";

export default class CartManager {
  constructor() {
    this.path = path.join("src", "data", "carts.json");
    this.carts = [];
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.carts = data ? JSON.parse(data) : [];
    } catch (error) {
      this.carts = [];
    }
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async getCarts() {
    await this.loadCarts();
    return this.carts;
  }

  async createCart() {
    await this.loadCarts();

    const newCart = {
      id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1,
      products: [],
    };

    this.carts.push(newCart);
    await this.saveCarts();

    return newCart;
  }

  async getCartById(cid) {
    await this.loadCarts();

    const cart = this.carts.find((c) => c.id == cid);
    if (!cart) throw new Error("Carrito no encontrado");

    return cart;
  }

  async addProductToCart(cid, pid) {
    await this.loadCarts();

    const index = this.carts.findIndex((c) => c.id == cid);
    if (index === -1) throw new Error("Carrito no encontrado");

    const cart = this.carts[index];

    const existingProduct = cart.products.find((p) => p.product == pid);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1,
      });
    }

    this.carts[index] = cart;
    await this.saveCarts();

    return cart;
  }
}
