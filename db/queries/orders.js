import db from "#db/client";

export async function createOrder(userid, date, note = null) {
  const {
    rows: [order],
  } = await db.query(
    `
        INSERT INTO orders (user_id, date, note)
        VALUES ($1, $2, $3)
        RETURNING *`,
    [userid, date, note]
  );
  return order;
}

//add products to an order
export async function addProductToOrder(orderId, productId, quantity) {
  const {
    rows: [orderProduct],
  } = await db.query(
    `
        INSERT INTO orders_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *`,
    [orderId, productId, quantity]
  );
  return orderProduct;
}

//get all orders by user
export async function getOrderByUserId(userId) {
  const { rows } = await db.query(
    `
        SELECT * From orders
        WHERE user_id = $1
        ORDER BY date DESC`,
    [userId]
  );
  return rows;
}

//get an order by order id
export async function getOrderById(id) {
  const {
    rows: [order],
  } = await db.query(
    `
        SELECT * FROM orders WHERE id = $1`,
    [id]
  );
  return order;
}

//get orders by a user w/ specific product
export async function getOrdersByUserAndProduct(userId, productId) {
  const { rows } = await db.query(
    `SELECT o.*
         FROM orders o
         JOIN orders_products op ON o.id = op.order_id
         WHERE o.user_id = $1 AND op.product_id = $2
         ORDER BY o.date DESC`,
    //can set alias' for table nows like above. o for orders and op for orders_products. makes for cleaner queries.
    [userId, productId]
  );
  return rows;
}

//check if an order is owned by a spec. user
export async function isOrderOwnedByUser(orderId, userId) {
  const {
    rows: [result],
  } = await db.query(
    `
        SELECT EXISTS(
        SELECT 1 FROM orders
        WHERE id = $1 AND user_id = $2)
        AS owned`,
    [orderId, userId]
  );
  return result.owned;
}
