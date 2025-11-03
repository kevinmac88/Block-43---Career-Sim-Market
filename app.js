import express from "express";
import getUserFromToken from "#utils/getUserFromToken.js";
import usersRouter from "#routers/users.js";
import productsRouter from "#routers/products.js";
import ordersRouter from "#routers/orders.js";

const app = express();

//MIDDLEWARE (order matters) --> parse body, extract user, route, catch errors
//parse JSON req body first -> so it is available to routes that need req.body
app.use(express.json());

//extract user from token
app.use(getUserFromToken);

//mount users router @ /users (where I have register & login POST routes)
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

//catch all error handler (must come last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal server error");
});

export default app;
