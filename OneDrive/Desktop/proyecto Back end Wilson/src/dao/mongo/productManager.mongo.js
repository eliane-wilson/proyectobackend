import { ProductModel } from "../../models/product.model.js";

export default class ProductManagerMongo {

  async getProducts(limit = 10, page = 1, query = {}, sort = null) {
    const options = {
      limit,
      page,
      lean: true
    };

    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const filter = query.category
      ? { category: query.category }
      : query.status
      ? { status: query.status }
      : {};

    return await ProductModel.paginate(filter, options);
  }

  async getProductById(id) {
    const product = await ProductModel.findById(id).lean();
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }

  async addProduct(productData) {
    const required = ["title","description","code","price","stock","category"];
    for (const field of required) {
      if (!productData[field]) {
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }

    const exists = await ProductModel.findOne({ code: productData.code });
    if (exists) throw new Error("El código del producto ya existe");

    const newProduct = await ProductModel.create(productData);
    return newProduct.toObject();
  }

  async updateProduct(id, data) {
    const updated = await ProductModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return updated;
  }

  async deleteProduct(id) {
    return await ProductModel.findByIdAndDelete(id).lean();
  }
}
