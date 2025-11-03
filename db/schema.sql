DROP TABLE IF EXISTS orders_products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username  TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    --optional constraint to check price is > 0 
    CONSTRAINT positive_price CHECK (price > 0 )
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY, 
    date DATE NOT NULL,
    note TEXT,
    user_id INTEGER NOT NULL REFERENCES  users(id) ON DELETE CASCADE
);

--junction table: many to many relationship between orders & products
CREATE TABLE orders_products (
    order_id INTEGER NOT NULL references orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL references products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    --composite PK: prevents adding same product to same order twice
    PRIMARY KEY (order_id, product_id),
    --constraint to ensure positive quantities
    CONSTRAINT positive_quantity CHECK (quantity > 0)
);

