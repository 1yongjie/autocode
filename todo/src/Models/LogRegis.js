const db = require('../config/db');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

class LAR {
    static async findUser(username) {

        try {
            const [rows] = await db.pool.query(`
                SELECT
                    user_id,
                    username,
                    password,
                    email
                FROM users
                WHERE username = ? OR email = ?
            `, [username, username]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('查找用户失败:', error);
            throw error;
        }
    }

    static async verifyUser(username, password) {
        try {
            const user = await this.findUser(username);
            if (!user) {
                return { success: false, message: '用户不存在' };
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { success: false, message: '密码错误' };
            }

            const token = jwt.sign(
                { user_id: user.user_id, username: user.username },
                config.jwt.secret,
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = user;
            
            return {
                success: true,
              user: {
        user_id: user.user_id, 
        username: user.username,
        email: user.email
      },
                token
            };
        } catch (error) {
            console.error('验证用户失败:', error.message);
            throw error;
        }
    }

    static async registerUser(username, email, password) {
        try {
            const existingUser = await this.findUser(username);
            if (existingUser) {
                return { success: false, message: '用户名或邮箱已被注册' };
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await db.pool.query(`
                INSERT INTO users (username, email, password)
                VALUES (?, ?, ?)
            `, [username, email, hashedPassword]);

            const [rows] = await db.pool.query(`
                SELECT 
                    user_id,
                    username,
                    email
                FROM users
                WHERE user_id = ?
            `, [result.insertId]);

            return {
                success: true,
                message: '注册成功',
                user: rows[0]
            };
        } catch (error) {
            console.error('注册用户失败:', error);
            throw error;
        }
    }

    static async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            return { success: true, decoded };
        } catch (error) {
            return { success: false, message: '无效的token' };
        }
    }
}

module.exports = LAR;