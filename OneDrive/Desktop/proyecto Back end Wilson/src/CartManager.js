import fs from "fs/promises";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      products: [],
    };

    carts.push(newCart);
    await this.saveCarts(carts);

    return newCart;
  }
  async getCartById(cid) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id == cid);
    if (!cart) throw new Error("Carrito no encontrado");
    return cart;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id == cid);
    if (cartIndex === -1) throw new Error("Carrito no encontrado");

    const cart = carts[cartIndex];

    const existingProduct = cart.products.find(p => p.product == pid);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    carts[cartIndex] = cart;
    await this.saveCarts(carts);

    return cart;
  }
}


