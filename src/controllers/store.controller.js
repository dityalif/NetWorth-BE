const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseresponse.util");

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse(res, true, 200, "Stores retrieved successfully", stores);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving stores", error);
    }
};

exports.createStore = async (req, res) => {
    if(!req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, "Name and address are required", null);
    }
    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 201, "Store created successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.getStoreId = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return baseResponse(res, false, 400, "ID is required", null);
    }
    try {
        const store = await storeRepository.getStoreId(id);
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store retrieved successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
}

exports.updateStore = async (req, res) => {
    const { id, name, address } = req.body;
    if (!id || !name || !address) {
        return baseResponse(res, false, 400, "ID, name, and address are required", null);
    }
    try {
        const store = await storeRepository.updateStore({ id, name, address });
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store updated successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
}

exports.deleteStore = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return baseResponse(res, false, 400, "ID is required", null);
    }
    try {
        const store = await storeRepository.getStoreId(id);
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        const success = await storeRepository.deleteStore(id);
        if (!success) {
            return baseResponse(res, false, 500, "Error deleting store", null);
        }
        baseResponse(res, true, 200, "Store deleted", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
}

