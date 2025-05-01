const transactionRepository = require("../repositories/transaction.repository");
const itemRepository = require("../repositories/item.repository");
const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseresponse.util");

exports.createTransaction = async (req, res) => {
  const { item_id, quantity, user_id } = req.body;
  
  if (!item_id || !user_id) {
    return baseResponse(res, false, 400, "Item ID, quantity, and user ID are required", null);
  }
  
  if (!quantity || isNaN(quantity) || quantity <= 0) {
    return baseResponse(res, false, 400, "Quantity must be larger than 0", null);
  }
  
  try {
    const item = await itemRepository.getItemById(item_id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    
    const user = await userRepository.getUserById(user_id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    
    if (item.stock < quantity) {
      return baseResponse(res, false, 400, "Not enough stock", null);
    }
    
    const transaction = await transactionRepository.createTransaction({
      item_id,
      quantity: parseInt(quantity),
      user_id
    });
    
    baseResponse(res, true, 201, "Transaction created", transaction);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.payTransaction = async (req, res) => {
  const id = req.params.id;
  
  if (!id) {
    return baseResponse(res, false, 400, "Transaction ID is required", null);
  }
  
  try {
    const transaction = await transactionRepository.getTransactionById(id);
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }
    
    if (transaction.status === "paid") {
      return baseResponse(res, false, 400, "Transaction is already paid", null);
    }
    
    const deductResult = await userRepository.deductBalance(transaction.user_id, transaction.total);
    if (!deductResult.success) {
      return baseResponse(res, false, 400, deductResult.message, null);
    }
    
    const updatedTransaction = await transactionRepository.payTransaction(id);
    if (!updatedTransaction) {
      await userRepository.topUpBalance(transaction.user_id, transaction.total);
      return baseResponse(res, false, 500, "Failed to update transaction", null);
    }
    
    baseResponse(res, true, 200, "Payment successful", updatedTransaction);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Failed to pay", error);
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionRepository.getAllTransactions();
    baseResponse(res, true, 200, "Transactions found", transactions);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.deleteTransaction = async (req, res) => {
  const id = req.params.id;
  
  if (!id) {
    return baseResponse(res, false, 400, "Transaction ID is required", null);
  }
  
  try {
    const transaction = await transactionRepository.getTransactionById(id);
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }
    
    const deletedTransaction = await transactionRepository.deleteTransaction(id);
    
    baseResponse(res, true, 200, "Transaction deleted", deletedTransaction);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

