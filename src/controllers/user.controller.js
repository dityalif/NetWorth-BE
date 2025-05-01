const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseresponse.util");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/

exports.register = async (req, res) => {
  const { email, password, name } = req.query;
  
  if (!email || !password || !name) {
    return baseResponse(res, false, 400, "Email, password, and name are required", null);
  }
  
  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }
  
  if (!passRegex.test(password)) {
    return baseResponse(res, false, 400, "Invalid Password", null);
  }
  
  try {
    const emailExists = await userRepository.checkEmailExists(email);
    if (emailExists) {
      return baseResponse(res, false, 400, "Email already used", null);
    }
    const user = await userRepository.register({ email, password, name });
    baseResponse(res, true, 201, "Login success", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.query;
  
  if (!email || !password) {
    return baseResponse(res, false, 400, "Email and password are required", null);
  }
    try {
    const user = await userRepository.login(email, password);
    if (!user) {
      return baseResponse(res, false, 400, "Invalid email or password", null);
    }
    baseResponse(res, true, 200, "Login success", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.getUserByEmail = async (req, res) => {
  const email = req.params.email;
  if (!email) {
    return baseResponse(res, false, 400, "Email is required", null);
  }
  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.updateUser = async (req, res) => {
  const { id, email, password, name } = req.body;
  if (!id || !email || !password || !name) {
    return baseResponse(res, false, 400, "ID, email, password, and name are required", null);
  }

  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }
  
  if (!passRegex.test(password)) {
    return baseResponse(res, false, 400, "Invalid Password", null);
  }

  try {
    const user = await userRepository.updateUser({ id, email, password, name });
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User updated", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return baseResponse(res, false, 400, "ID is required", null);
  }
  try {
    const user = await userRepository.deleteUser(id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User deleted", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};

exports.topUpBalance = async (req, res) => {
  const { id, amount } = req.query;

  if (!id || !amount) {
    return baseResponse(res, false, 400, "ID and amount are required", null);
  }

  if (!amount || isNaN(amount) || amount <= 0) {
    return baseResponse(res, false, 400, "Amount must be larger than 0", null);
  }

  try {
    const user = await userRepository.topUpBalance(id, parseFloat(amount));
    
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    
    baseResponse(res, true, 200, "Balance updated successfully", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error);
  }
};