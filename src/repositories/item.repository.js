const db = require("../database/pg.database");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dlory7axg",
  api_key: "747285362863923",
  api_secret: "RvCS5QUBThZeSNh1hMsYOzZ-r5c"
});

exports.uploadImage = async (file) => {
  if (!file) {
    throw new Error("Missing image file");
  }
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "item_images", 
          resource_type: "auto"  
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(file.buffer);
    });
    return {
      url: result.secure_url
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.createItem = async (item) => {
  try {
    const res = await db.query(
      "INSERT INTO items (name, price, store_id, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [item.name, item.price, item.store_id, item.stock, item.image_url]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.getAllItems = async () => {
  try {
    const result = await db.query("SELECT * FROM items");
    return result.rows;
  } catch (error) {
    console.error("Error fetching all items:", error);
    throw error;
  }
};

exports.getItemById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM items WHERE id = $1", [id]);
    if (!result) return null; 
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    return null; 
  }
};

exports.getItemsByStoreId = async (storeId) => {
  try {
    const result = await db.query("SELECT * FROM items WHERE store_id = $1", [storeId]);
    if (!result) return [];
    return result.rows;
  } catch (error) {
    console.error("Error fetching items by store ID:", error);
    return [];
  }
};

exports.updateItem = async (item) => {
  try {
    const res = await db.query(
      "UPDATE items SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5 WHERE id = $6 RETURNING *",
      [item.name, item.price, item.store_id, item.image_url, item.stock, item.id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

exports.deleteItem = async (id) => {
  try {
    const res = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};
