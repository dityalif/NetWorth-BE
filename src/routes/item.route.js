const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const multer = require('multer');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

router.get('/', itemController.getAllItems);
router.post('/create', upload.single('image'), itemController.createItem);
router.get('/byId/:id', itemController.getItemById);
router.get('/byStoreId/:store_id', itemController.getItemsByStoreId);
router.put('/', upload.single('image'), itemController.updateItem);
router.delete('/:id', itemController.deleteItem); // Add this line for deleteItem

module.exports = router;