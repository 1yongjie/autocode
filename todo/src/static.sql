-- 创建数据库
CREATE DATABASE IF NOT EXISTS todo_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE todo_app;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 创建待办事项表
CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_task_id INT NOT NULL,  
    title VARCHAR(100) NOT NULL,
    content TEXT,
    planned_time DATETIME NOT NULL,
    is_completed TINYINT(1) DEFAULT 0,
    is_important TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_task (user_id, user_task_id),  -- 确保每个用户的任务ID唯一
    INDEX idx_user_planned_time (user_id, planned_time),
    INDEX idx_user_completed (user_id, is_completed)
) ENGINE=InnoDB;

-- 插入测试用户 (密码均为123456，已加密)
INSERT INTO users (username, email, password) VALUES
('user1', 'user1@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('user2', 'user2@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('user3', 'user3@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('user4', 'user4@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('user5', 'user5@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- 插入测试待办事项)
INSERT INTO todos (user_id, user_task_id, title, content, planned_time) VALUES
-- 用户1的待办事项 
(1, 1, '完成项目报告', '撰写并提交季度项目报告', DATE_ADD(CURDATE(), INTERVAL 3 HOUR)),
(1, 2, '开会讨论', '与团队讨论新功能需求', DATE_ADD(CURDATE(), INTERVAL 5 HOUR)),
(1, 3, '回复邮件', '回复客户关于产品的咨询', DATE_ADD(CURDATE(), INTERVAL 1 HOUR)),

-- 用户2的待办事项
(2, 1, '购买办公用品', '采购打印机和A4纸', DATE_ADD(CURDATE(), INTERVAL 2 HOUR)),
(2, 2, '安排面试', '筛选简历并安排候选人面试', DATE_ADD(CURDATE(), INTERVAL 4 HOUR)),

-- 用户3的待办事项 
(3, 1, '健身锻炼', '去健身房进行1小时训练', DATE_ADD(CURDATE(), INTERVAL 6 HOUR)),
(3, 2, '阅读书籍', '阅读《Vue实战》第5章', DATE_ADD(CURDATE(), INTERVAL 8 HOUR)),
(3, 3, '准备晚餐', '购买食材并准备晚餐', DATE_ADD(CURDATE(), INTERVAL 7 HOUR)),

-- 用户4的待办事项 
(4, 1, '客户拜访', '前往ABC公司进行业务洽谈', DATE_ADD(CURDATE(), INTERVAL 3 HOUR)),
(4, 2, '整理文件', '整理并归档上个月的合同文件', DATE_ADD(CURDATE(), INTERVAL 9 HOUR)),

-- 用户5的待办事项 
(5, 1, '学习Node.js', '学习Express框架基础', DATE_ADD(CURDATE(), INTERVAL 2 HOUR)),
(5, 2, '打电话', '给家人打电话问候', DATE_ADD(CURDATE(), INTERVAL 5 HOUR)),
(5, 3, '处理账单', '支付水电费和物业费', DATE_ADD(CURDATE(), INTERVAL 10 HOUR));