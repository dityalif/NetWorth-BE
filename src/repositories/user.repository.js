const db = require("../database/pg.database");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

exports.register = async (user) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    
    const res = await db.query(
      "INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *",
      [user.name, user.email, hashedPassword, 0]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.checkEmailExists = async (email) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows.length > 0;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.login = async (email, password) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = res.rows[0];
    
    if (!user) return null;
    
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) return null;
    
    return user;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

exports.getUserById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.updateUser = async (user) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    
    const res = await db.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [user.name, user.email, hashedPassword, user.id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.deleteUser = async (id) => {
  try {
    const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.topUpBalance = async (id, amount) => {
  try {
    const res = await db.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *", 
      [amount, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.deductBalance = async (id, amount) => {
  try {
    const user = await exports.getUserById(id);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    
    if (user.balance < amount) {
      return { success: false, message: "Insufficient balance" };
    }
    
    const res = await db.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2 RETURNING *", 
      [amount, id]
    );
    
    return { success: true, user: res.rows[0] };
  } catch (error) {
    console.error("Error deducting balance:", error);
    throw error;
    return { success: false, message: error.message };
  }
};