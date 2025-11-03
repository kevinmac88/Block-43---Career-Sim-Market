import db from "./client.js";
import { createUser } from "./queries/users.js";
import { createProduct } from "./queries/products.js";
import { createOrder, addProductToOrder } from "./queries/orders.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  //create  test user
  try {
    console.log("Creating test user...");

    const user = await createUser("testuser", "password123");
    console.log(`Created user: ${user.username} w/ ID ${user.id}`);

    //create 10 products
    console.log("Creating products...");

    const productsData = [
      {
        title: "Wireless Bluetooth Headphones",
        description:
          "High-quality over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality.",
        price: 149.99,
      },
      {
        title: "Mechanical Gaming Keyboard",
        description:
          "RGB backlit mechanical keyboard with Cherry MX switches, programmable macros, and aluminum frame.",
        price: 89.99,
      },
      {
        title: "4K Webcam",
        description:
          "Professional webcam with 4K resolution, autofocus, built-in dual microphones, and adjustable tripod mount.",
        price: 129.99,
      },
      {
        title: "Ergonomic Wireless Mouse",
        description:
          "Vertical ergonomic mouse designed to reduce wrist strain, with 6 programmable buttons and precision tracking.",
        price: 45.99,
      },
      {
        title: "USB-C Hub 7-in-1",
        description:
          "Multiport adapter with HDMI 4K output, 3x USB 3.0, SD card reader, and 100W power delivery.",
        price: 39.99,
      },
      {
        title: "Portable SSD 1TB",
        description:
          "Ultra-fast external solid state drive with USB-C 3.2 interface and transfer speeds up to 1050MB/s.",
        price: 119.99,
      },
      {
        title: "LED Desk Lamp",
        description:
          "Adjustable LED desk lamp with touch controls, USB charging port, 5 brightness levels, and eye-care technology.",
        price: 34.99,
      },
      {
        title: "Aluminum Laptop Stand",
        description:
          "Ergonomic laptop stand with adjustable height, improved airflow, and cable management for laptops up to 17 inches.",
        price: 29.99,
      },
      {
        title: "Blue Light Blocking Glasses",
        description:
          "Computer glasses that filter blue light to reduce eye strain, headaches, and improve sleep quality.",
        price: 24.99,
      },
      {
        title: "Wireless Charging Pad",
        description:
          "Fast wireless charging pad compatible with all Qi-enabled devices, with LED indicator and non-slip surface.",
        price: 19.99,
      },
    ];

    //insert products
    const products = [];
    for (const productData of productsData) {
      const product = await createProduct(
        productData.title,
        productData.description,
        productData.price
      );
      products.push(product);
      console.log(`Created ${product.title} - $${product.price}`);
    }

    //create an order
    console.log("Creating test order...");

    //this date format looks crazy - found out it has to do with hacking together JS date object & postgres date format(ISO). Research further.
    const today = new Date().toISOString().split("T")[0];

    const order = await createOrder(
      user.id,
      today,
      "Test order for dev & testing"
    );

    console.log(`Created order #${order.id} for ${user.username}`);

    //add 5 products to order
    console.log("Adding products to order...");

    const quantities = [2, 1, 3, 1, 2];
    //use first 5 products with varying quantities
    for (let i = 0; i < 5; i++) {
      const product = products[i];
      const quantity = quantities[i];

      await addProductToOrder(order.id, product.id, quantity);
      console.log(`Added ${quantity}x ${product.title}`);
    }

    //calculate and display order total
    let total = 0;
    for (let i = 0; i < 5; i++) {
      total += products[i].price * quantities[i];
    }

    console.log(`Order total: $${total.toFixed(2)}`);
    console.log("SEEDING COMPLETED SUCCESFULLY");
  } catch (error) {
    console.error("Seeding failed", error);
    throw error;
  }
}
