const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');

router.post('/create', storeController.createStore);
router.get('/getAll', storeController.getAllStores);
router.get('/:id', storeController.getStoreId);
router.put('/', storeController.updateStore);
router.delete('/:id', storeController.deleteStore); // Add this line for deleteStore

module.exports = router;