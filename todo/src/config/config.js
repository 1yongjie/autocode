const path = require('path');
require('dotenv').config({ 
  path: path.resolve(__dirname, '../.env') 
});

const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME || 'todo_app',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONN_LIMIT) || 100,
    queueLimit: 0
  },

  jwt: {
    secret: process.env.JWT_SECRET||'6d385ec06ed257261aca2957ff9beef454c61bb1d378bf92c0ae2fd5668a4d4a', 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    algorithm: 'HS256'
  },

  app: {
    port: parseInt(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
  }
};

if (config.app.env === 'production') {
  const required = ['JWT_SECRET', 'DB_PASSWORD'];
  required.forEach(env => {
    if (!process.env[env]) throw new Error(`生产环境必须配置 ${env}`);
  });
}

module.exports = config;