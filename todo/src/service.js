const path = require('path');
require('dotenv').config({ 
  path: path.resolve(__dirname, '../.env') 
});
const express = require('express');
const cors = require('cors');
const { pool,testConnection } = require('./config/db');

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf; // 可选：保存原始数据
  },
  strict: false // 允许非对象JSON
}));
app.use(express.urlencoded({ extended: true })); 

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


const authRouter = require('./Routes/LogRegis'); 
app.use('/api/auth', authRouter); 

const router = require('./Routes'); 
app.use('/api', router);

app.get('/test-db', async (req, res) => {
  const isConnected = await testConnection();
  if (isConnected) {
    res.json({ success: true, message: '数据库连接成功' });
  } else {
    res.status(500).json({ success: false, error: '数据库连接失败' });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`测试数据库连接:http://localhost:${PORT}/test-db`);
});

module.exports = app;