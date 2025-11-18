import fs from "fs/promises";

export default class ProductManager {
  constructor(path , io) {
    this.path = path;
    this.io = io;
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

  async getProductById(id) {
    await this.loadProducts();
    const product = this.products.find(p => p.id == id);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }

  async addProduct(product) {
    await this.loadProducts();

    const requiredFields = ["title", "description", "code", "price", "status", "stock", "category"];
    for (const field of requiredFields) {
      if (!product[field]) {
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }

    if (this.products.some(p => p.code === product.code)) {
      throw new Error("El código del producto ya existe");
    }
    
    const id = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
    const newProduct = { 
      id,
      thumbnails: [],
      ...product 
    };

    this.products.push(newProduct);
    await this.saveProducts();

    io.emit("productsUpdated", this.products);
    return newProduct;

    
  }

    async updateProduct(id, updatedData) {
    await this.loadProducts();
    const index = this.products.findIndex(p => p.id == id);

    if (index === -1) throw new Error("Producto no encontrado");

    delete updatedData.id;
    this.products[index] = { ...this.products[index], ...updatedData };
    await this.saveProducts();

    return this.products[index];
  }

  async deleteProduct(id) {
    await this.loadProducts();
    const index = this.products.findIndex(p => p.id == id);
    if (index === -1) throw new Error("Producto no encontrado");

    const deletedProduct = this.products.splice(index, 1)[0];
    await this.saveProducts();

    io.emit("productsUpdated", this.products);
     return deletedProduct;

  }
}

