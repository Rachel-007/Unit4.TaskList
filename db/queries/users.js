import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(username, password) {
  // in practice, DON'T return * the select columns, certainly don't return password
  //   in practice a try catch block would be used to handle errors here
  const sql = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}
export async function getUserByUsernameAndPassword(username, password) {
  const sql = `SELECT * FROM users WHERE username = $1`;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) {
    return null;
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }
  return user;
}
export async function getUserById(id) {
  const sql = `SELECT * FROM users WHERE id = $1`;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
