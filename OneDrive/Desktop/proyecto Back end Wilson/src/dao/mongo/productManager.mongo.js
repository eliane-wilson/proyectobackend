import { ProductModel } from "../../models/product.model.js";

export default class ProductManagerMongo {

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    const filter = {};
    if (query) {
      filter.$or = [
        { category: query },
        { status: query.toLowerCase() === "true" ? true : false }
      ];
    }

    const options = {
      page,
      limit,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
      lean: true
    };

    return await ProductModel.paginate(filter, options);
  }

  async getProductById(id) {
    const product = await ProductModel.findById(id).lean();
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }

  async addProduct(productData) {
    const existing = await ProductModel.findOne({ code: productData.code });
    if (existing) throw new Error("El código del producto ya existe");
    const newProduct = await ProductModel.create(productData);
    return newProduct.toObject();
  }

  async updateProduct(id, updatedData) {
    const updated = await ProductModel.findByIdAndUpdate(id, updatedData, { new: true }).lean();
    if (!updated) throw new Error("Producto no encontrado");
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await ProductModel.findByIdAndDelete(id).lean();
    if (!deleted) throw new Error("Producto no encontrado");
    return deleted;
  }
}
