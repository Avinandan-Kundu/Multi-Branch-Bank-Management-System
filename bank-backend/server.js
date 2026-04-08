const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const branchRoutes = require('./routes/branchRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const transactionRoutes = require('./routes/transactionRoutes'); 
const authRoutes = require('./routes/authRoutes');
const { connectRabbitMQ } = require('./config/rabbitmq'); 
const startTransactionConsumer = require('./consumers/transactionConsumer');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/branches', branchRoutes); 
app.use('/api/employees', employeeRoutes); 
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
// test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    await connectRabbitMQ();
    await startTransactionConsumer();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));