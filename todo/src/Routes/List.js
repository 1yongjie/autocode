const express = require('express');
const router = express.Router();
const ListTodo = require('../Models/List');
//查
router.get('/todos/:userId', async(req, res) => {
    try{

        const todos= await ListTodo.Findbyuserid(req.params.userId);
        res.json({
      success: true,
      data: todos
    });
    }catch (error) {
    console.error('Error getting todos:', error);
  }
});
//删
router.delete('/todos/:user_id/:user_task_id', async(req, res) => {
    try {
        const { user_id, user_task_id } = req.params;
        
        const success = await ListTodo.Deletebytodoid(
            parseInt(user_id), 
            parseInt(user_task_id)
        );
            if (success) {
            res.json({ success: true });
        } else {
            res.status(404).json({
                success: false,
                error: '未找到该待办事项'
            });
        }
    } catch (error) {
        console.error('删除待办事项失败:', error);
    }
});
//改完成
router.patch('/todos/:user_id/:user_task_id/finish', async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id);
        const user_task_id = parseInt(req.params.user_task_id);
        const is_completed = Boolean(req.body.ifFinish);
        if (isNaN(user_id) || isNaN(user_task_id)) {
            return res.status(400).json({ error: '无效的ID格式' });
        }

        const success = await ListTodo.ChangeTodoFinish(
            user_id,
            user_task_id,
            is_completed
        );

        if (!success) {
            return res.status(404).json({ error: '记录不存在或未更改' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('完整错误堆栈:', error);
        res.status(500).json({ error: '数据库操作失败' });
    }
});
//编辑
router.put('/todos/:user_task_id', async (req, res) => {
  try {
    const { user_task_id } = req.params;
    const { userId, title, content, deadline } = req.body;

    const result = await ListTodo.updateTodoExit(
      userId, 
      user_task_id,
      { title, content, deadline }
    );
    
    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: '未找到该待办事项' });
    }
  } catch (error) {
    console.error('保存失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});
//增
router.post('/todos', async (req, res) => {
  try {
    const todoData = req.body;
    const newRecord = await ListTodo.AddTodo(todoData); 
    res.json({
      success: true,
      ...newRecord 
    });
  } catch (error) {
    console.error('添加待办事项失败:', error);
    res.status(500).json({ error: '添加失败' });
  }
});
module.exports = router;