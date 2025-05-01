const db = require("../database/pg.database");

exports.createTransaction = async (transaction) => {
  try {
    const itemResult = await db.query("SELECT price FROM items WHERE id = $1", [transaction.item_id]);
    if (itemResult.rows.length === 0) {
      throw new Error("Item not found");
    }
    
    const itemPrice = itemResult.rows[0].price;
    const total = itemPrice * transaction.quantity;
    
    const res = await db.query(
      "INSERT INTO transactions (user_id, item_id, quantity, total, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [transaction.user_id, transaction.item_id, transaction.quantity, total, "pending"]
    );
    
    return res.rows[0];
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

exports.getTransactionById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
    if (!result) return null;
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    return null; 
  }
};

exports.getAllTransactions = async () => {
  try {
    const transactions = await db.query("SELECT * FROM transactions");
    const userIds = transactions.rows.map((t) => t.user_id);
    const itemIds = transactions.rows.map((t) => t.item_id);

    const users = await db.query("SELECT * FROM users WHERE id = ANY($1)", [userIds]);
    const items = await db.query("SELECT * FROM items WHERE id = ANY($1)", [itemIds]);

    const userMap = new Map(users.rows.map((u) => [u.id, u]));
    const itemMap = new Map(items.rows.map((i) => [i.id, i]));

    return transactions.rows.map((transaction) => ({
      ...transaction,
      user: userMap.get(transaction.user_id),
      item: itemMap.get(transaction.item_id),
    }));
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    throw error;
  }
};

exports.payTransaction = async (id) => {
  try {
    const res = await db.query(
      "UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *",
      ["paid", id]
    );
    
    if (res.rows.length === 0) {
      return null;
    }
    
    return res.rows[0];
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

exports.deleteTransaction  = async (id) => {
  try {
    const res = await db.query(
      "DELETE FROM transactions WHERE id = $1 RETURNING *",
      [id]
    );
    
    if (res.rows.length === 0) {
      return null;
    }
    
    return res.rows[0];
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};