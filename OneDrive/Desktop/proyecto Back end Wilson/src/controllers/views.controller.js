import ProductManagerMongo from "../dao/mongo/productManager.mongo.js";
import CartManagerMongo from "../dao/mongo/cartManager.mongo.js";

const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();

export const getProductsView = async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    const filters = {};
    if (query) {
      filters.$or = [
        { category: query },
        { status: query.toLowerCase() === "true" ? true : false }
      ];
    }

    const options = {
      limit,
      page,
      sort: {}
    };

    if (sort === "asc") options.sort.price = 1;
    else if (sort === "desc") options.sort.price = -1;

    const productsPaginated = await productManager.getPaginatedProducts(filters, options);

    res.render("home", {
      products: productsPaginated.docs,
      page: productsPaginated.page,
      totalPages: productsPaginated.totalPages,
      hasPrevPage: productsPaginated.hasPrevPage,
      hasNextPage: productsPaginated.hasNextPage,
      prevPage: productsPaginated.prevPage,
      nextPage: productsPaginated.nextPage,
      limit,
      sort,
      query
    });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
};

export const getProductByIdView = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    res.render("product", { product });
  } catch (error) {
    res.status(404).send("Producto no encontrado");
  }
};

export const getCartView = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    res.render("cart", { cart });
  } catch (error) {
    res.status(404).send("Carrito no encontrado");
  }
};
