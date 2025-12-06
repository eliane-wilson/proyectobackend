import { ProductModel } from "./models/product.model.js";

export default class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query }) {
      const filter = {};
    if (query) {
        if (query === "available") filter.status = true;
        else filter.category = query;
    }
    const options = {
      limit,
      page,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
      lean: true
    };
    const result = await ProductModel.paginate(filter, options);

    return {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
    };
  }

  async getProductById(id) {
    const product = await ProductModel.findById(id).lean();
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }

  async addProduct(productData) {
    const exists = await ProductModel.findOne({ code: productData.code });
    if (exists) throw new Error("El código del producto ya existe");

    const newProduct = await ProductModel.create(productData);
    return newProduct;
  }

  async updateProduct(id, updatedData) {
    const product = await ProductModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }


   async deleteProduct(id) {
    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted) throw new Error("Producto no encontrado");
    return deleted;
  }
}