const express = require('express');
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.port || 3000;

const corsOptions = {
  origin: ["http://os.netlabdte.com", "http://localhost:5173", "http://8.215.45.41:3000"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/store', require('./src/routes/store.route'));
app.use('/user', require('./src/routes/user.route')); 
app.use('/item', require('./src/routes/item.route')); 
app.use('/transaction', require('./src/routes/transaction.route'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


