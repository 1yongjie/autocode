const express = require('express');
const router = express.Router();
const LAR = require('../Models/LogRegis');
const config = require('../config/config');

router.get('/test-connection', async (req, res) => {
  try {
    res.json({
      success: true,
      message: '后端连接成功',
      timestamp: new Date().toISOString(),
      data: {
        status: 'active',
        version: '1.0.0'
      }
    });
  } catch (error) {
    console.error('测试连接错误:', error);
    res.status(500).json({
      success: false,
      message: '后端连接测试失败'
    });
  }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await LAR.verifyUser(username, password);
        
        if (!result.success) {
            return res.status(401).json({ 
                success: false,
                message: result.message 
            });
        }

        res.json({
            success: true,
            user: result.user,
            token: result.token
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ 
            success: false,
            message: '服务器错误' 
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const result = await LAR.registerUser(username, email, password);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        const loginResult = await LAR.verifyUser(username, password);
        
        res.json({
            success: true,
            user: loginResult.user,
            token: loginResult.token
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;