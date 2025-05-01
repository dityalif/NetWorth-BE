const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:email', userController.getUserByEmail);
router.put('/', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/topUp', userController.topUpBalance);

module.exports = router;