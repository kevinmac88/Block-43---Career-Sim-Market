import db from "#db/client";
import bcrypt from "bcrypt";

//create new user w/ hashed pw
export async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const {
    rows: [user],
  } = await db.query(
    `INSERT INTO users (username, password)
        VALUES ($1, $2)
        RETURNING id, username`,
    [username, hashedPassword]
  );
  return user;
}

//retrieve user by id
export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query(`SELECT id, username FROM users WHERE id = $1`, [id]);
  return user;
}

//retrieves user by username (required for login)
export async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await db.query(
    `SELECT id, username, password FROM users WHERE username = $1`,
    [username]
  );
  return user;
}
