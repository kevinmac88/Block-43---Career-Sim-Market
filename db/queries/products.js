import db from "../client.js";

//create new product
export async function createProduct(title, description, price) {
  const {
    rows: [product],
  } = await db.query(
    `INSERT INTO products (title, description, price)
        VALUES ($1, $2, $3)
        RETURNING *`,
    [title, description, price]
  );
  return product;
}

//get all products
export async function getAllProducts() {
  const { rows } = await db.query(`SELECT * FROM products ORDER BY id`);
  return rows;
}

//get product by id
export async function getProductById(id) {
  const {
    rows: [product],
  } = await db.query(`SELECT * FROM products WHERE id = $1 `, [id]);
  return product;
}

//check if product exists(more performant than select * for finding a product)
export async function productExists(id) {
  const {
    rows: [result],
  } = await db.query(
    `SELECT EXISTS(SELECT 1 FROM products WHERE id = $1) AS exists`,
    [id]
  );
  return result.exists;
}
