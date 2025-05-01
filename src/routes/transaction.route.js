const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.get('/', transactionController.getAllTransactions);
router.post('/create', transactionController.createTransaction);
router.post('/pay/:id', transactionController.payTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;

