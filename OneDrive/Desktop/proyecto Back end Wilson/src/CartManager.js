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
}
