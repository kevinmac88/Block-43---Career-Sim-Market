import express from "express";
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  addProductToOrder,
  getProductsByOrderId,
} from "#db/queries/orders.js";
import { productExists } from "#db/queries/products.js";
import requireUser from "#utils/requireUser.js";
import requireBody from "#utils/requireBody.js";

const router = express.Router();

//all routes in orders router need requireUser & require authentication

router.use(requireUser);

//create new order for logged in user
router.post("/", requireBody(["date"]), async (req, res, next) => {
  try {
    const { date, note } = req.body;
    const order = await createOrder(req.user.id, date, note);
    res.status(201).send(order);
  } catch (error) {
    next(error);
  }
});

//get all orders by logged in user
router.get("/", async (req, res, next) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);

    res.send(orders);
  } catch (error) {
    next(error);
  }
});

//get order by order id
router.get("/:id", async (req, res, next) => {
  try {
    const orderId = +req.params.id;
    //check if order exists
    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).send("order not found");
    }
    //check if user owns order
    if (order.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }
    res.send(order);
  } catch (error) {
    next(error);
  }
});

//add product to order
router.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res, next) => {
    try {
      const orderId = +req.params.id;
      const { productId, quantity } = req.body;

      const order = await getOrderById(orderId);
      if (!order) {
        return res.status(404).send("Order not found.");
      }

      //does user own order in question
      if (order.user_id !== req.user.id) {
        return res.status(403).send("Forbidden.");
      }

      //check product exists
      const exists = await productExists(productId);
      if (!exists) {
        return res.status(400).send("Product does not exist.");
      }

      //add product to order
      const orderProduct = await addProductToOrder(
        orderId,
        productId,
        quantity
      );

      res.status(201).send(orderProduct);
    } catch (error) {
      // handles composite key violation(adding same product to same order twice)

      if (error.code === "23505") {
        //postgres unique violation
        return res.status(400).send("Product already in order.");
      }
      next(error);
    }
  }
);

//get all products in a specific order
router.get("/:id/products", async (req, res, next) => {
  try {
    const orderId = +req.params.id;

    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).send("Order not found.");
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }

    const products = await getProductsByOrderId(orderId);

    res.send(products);
  } catch (error) {
    next(error);
  }
});

export default router;
