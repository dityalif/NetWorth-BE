const itemRepository = require("../repositories/item.repository");
const storeRepository = require("../repositories/store.repository"); 
const baseResponse = require("../utils/baseresponse.util");

exports.createItem = async (req, res) => {
  try {
    const { name, price, store_id, stock } = req.body;
    
    if (!name || !price || !store_id || !stock || !req.file) {
      return baseResponse(res, false, 400, "All fields are required (name, price, store_id, stock, image)", null);
    }
    const storeExists = await storeRepository.getStoreId(store_id);
    if (!storeExists) {
      return baseResponse(res, false, 404, "Store doesnt exist", null);
    }
    let imageResponse;
    try {
      imageResponse = await itemRepository.uploadImage(req.file);
    } catch (error) {
      return baseResponse(res, false, 500, "Failed to upload image", error);
    }
    const imageUrl = imageResponse.url;
    
    const item = await itemRepository.createItem({
      name,
      price: parseInt(price),
      store_id,
      stock: parseInt(stock),
      image_url: imageUrl
    });
    
    baseResponse(res, true, 201, "Item created", item);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    baseResponse(res, true, 200, "Items retrieved successfully", items);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.getItemById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return baseResponse(res, false, 400, "Item ID is required", null);
  }
  
  try {
    const item = await itemRepository.getItemById(id);
    
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    
    baseResponse(res, true, 200, "Item found", item);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.getItemsByStoreId = async (req, res) => {
  const storeId = req.params.store_id;
  if (!storeId) {
    return baseResponse(res, false, 400, "Store ID is required", null);
  }
  
  try {
    const storeExists = await storeRepository.getStoreId(storeId);
    if (!storeExists) {
      return baseResponse(res, false, 404, "Store doesnt exist", null);
    }
    
    const items = await itemRepository.getItemsByStoreId(storeId);
    
    baseResponse(res, true, 200, "Items found", items);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { name, price, store_id, stock, id } = req.body;
    
    if (!name || !price || !store_id || !stock || !id) {
      return baseResponse(res, false, 400, "All fields are required (name, price, store_id, stock, id)", null);
    }
    
    const storeExists = await storeRepository.getStoreId(store_id);
    if (!storeExists) {
      return baseResponse(res, false, 404, "Store doesnt exist", null);
    }
    
    const existingItem = await itemRepository.getItemById(id);
    if (!existingItem) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    
    let imageUrl = existingItem.image_url;
    
    if (req.file) {
      try {
        const imageResponse = await itemRepository.uploadImage(req.file);
        imageUrl = imageResponse.url;
      } catch (error) {
        return baseResponse(res, false, 500, "Failed to upload image", error);
      }
    }
    
    const item = await itemRepository.updateItem({
      id,
      name,
      price: parseInt(price),
      store_id,
      stock: parseInt(stock),
      image_url: imageUrl
    });
    
    baseResponse(res, true, 200, "Item updated", item);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return baseResponse(res, false, 400, "Item ID is required", null);
  }
  
  try {
    const item = await itemRepository.getItemById(id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    
    const deletedItem = await itemRepository.deleteItem(id);
    
    baseResponse(res, true, 200, "Item deleted", deletedItem);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};
