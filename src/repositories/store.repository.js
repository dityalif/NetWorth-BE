const db = require("../database/pg.database");

exports.getAllStores = async () => {
  try {
    const result = await db.query("SELECT * FROM stores");
    return result.rows;
  } catch (error) {
    console.error("Error fetching all stores:", error);
    throw error;
  }
};

exports.createStore = async (store) => {
  try {
    const res = await db.query(
      "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
      [store.name, store.address]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.deleteStore = async (id) => {
    try {
        const res = await db.query("DELETE FROM stores WHERE id = $1", [id]);
        return res.rowCount > 0;
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
}

exports.getStoreId = async (id) => {
    try {
        const res = await db.query("SELECT * FROM stores WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
}

exports.updateStore = async (store) => {
  try {
    const res = await db.query(
      "UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *",
      [store.name, store.address, store.id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}