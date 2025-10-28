import fs from "fs/promises";

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = data ? JSON.parse(data) : [];
    } catch {
      this.products = [];
    }
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }

  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  async addProduct(product) {
    await this.loadProducts();

    const id = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
    const newProduct = { id, ...product };

    this.products.push(newProduct);
    await this.saveProducts();

    return newProduct;
  }
}
