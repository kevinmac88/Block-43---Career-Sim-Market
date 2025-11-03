import express from "express";
import { getAllProducts, getProductById } from "../db/queries/products.js";
import { getOrdersByUserAndProduct } from "../db/queries/orders.js";
import requireUser from "../utils/requireUser.js";

const router = express.Router();

//get all products
router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

//get product by id
router.get("/:id", async (req, res, next) => {
  try {
    const productId = +req.params.id;
    //convert from string to a # for db query (req.params are always a string)

    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.send(product);
  } catch (error) {
    next(error);
  }
});

//get all orders by logged in user that include a product
router.get("/:id/orders", requireUser, async (req, res, next) => {
  try {
    const productId = +req.params.id;

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const orders = await getOrdersByUserAndProduct(req.user.id, productId);
    res.send(orders);
  } catch (error) {
    next(error);
  }
});

export default router;
