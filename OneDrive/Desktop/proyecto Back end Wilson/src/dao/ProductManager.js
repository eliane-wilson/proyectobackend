import ProductModel from "../models/product.model.js";

export default class ProductManager {

async getProducts({ limit = 10, page = 1, sort, query }) {
    const filter = {};

    if (query) {
      filter.$or = [
        { category: query },
        { status: query === "true" },
        { status: query === "false" }
      ];
    }

    let sortOption = {};
    if (sort === "asc") sortOption = { price: 1 };
    if (sort === "desc") sortOption = { price: -1 };

    const result = await ProductModel.paginate(filter, {
      limit,
      page,
      sort: sortOption,
      lean: true
    });

    return {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
    };
  }

  async getProductById(id) {
    const product = await ProductModel.findById(id).lean();
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }
  async addProduct(productData) {

    if (
      !productData.title ||
      !productData.description ||
      !productData.code ||
      !productData.price ||
      productData.status === undefined ||
      !productData.stock ||
      !productData.category
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    const exists = await ProductModel.findOne({ code: productData.code });
    if (exists) {
      throw new Error("El código del producto ya existe");
    }

    const newProduct = await ProductModel.create({
      thumbnails: [],
      ...productData
    });

    return newProduct;
  }

  async updateProduct(id, updatedData) {
    const updated = await ProductModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updated) throw new Error("Producto no encontrado");

    return updated;
  }

  async deleteProduct(id) {
    const deleted = await ProductModel.findByIdAndDelete(id);

    if (!deleted) throw new Error("Producto no encontrado");

    return deleted;
  }
}
