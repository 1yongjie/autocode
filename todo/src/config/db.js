const path = require('path');
require('dotenv').config({ 
  path: path.resolve(__dirname, '../.env') 
});
const mysql = require('mysql2/promise');


const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'todo_app',
  port: parseInt(process.env.DB_PORT) || 3307,  
  charset: 'utf8mb4', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(poolConfig);

const testConnection = async () => {
  let connection;
  try {
    console.log('🔄 正在尝试连接数据库...');
    console.log('连接参数:', {
      host: poolConfig.host,
      user: poolConfig.user,
      database: poolConfig.database,
      port: poolConfig.port
    });
    
    connection = await pool.getConnection();
    console.log('✅ 成功获取数据库连接');
    
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('测试查询结果:', rows[0].result);
    
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:');
    console.error('错误信息:', error.message);
    console.error('错误代码:', error.code);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('可能原因: 用户名或密码错误');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('可能原因: MySQL服务未启动或端口错误');
    }
    
    return false;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  pool,
  testConnection
};