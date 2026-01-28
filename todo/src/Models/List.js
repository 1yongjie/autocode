const db=require('../config/db')

class ListTodo{
    static async Findbyuserid(userId){
        const[rows]=await db.pool.query(`
        SELECT
            id,
            user_id AS userId,
            user_task_id AS userTaskId,
            title,
            content,
            planned_time AS deadline,
            is_completed AS ifFinish
        FROM todos
        WHERE user_id = ?
        ORDER BY planned_time ASC
            `,[userId]);
        return rows;
    }

    static async Deletebytodoid(user_id,user_task_id){
        const[result]=await db.pool.query(`
            DELETE FROM todos 
            WHERE user_id = ? AND user_task_id = ?
            `,[user_id,user_task_id]);
        return result;
    }

    static async ChangeTodoFinish(user_id,user_task_id,is_completed){
        const[result]=await db.pool.query(`
            UPDATE todos
            SET is_completed = ? 
            WHERE user_id = ? AND user_task_id = ?
            `, [is_completed, user_id, user_task_id]);
            return result.affectedRows > 0;
    }

   static async updateTodoExit(userId, user_task_id, todoData) {
    const { title, content, deadline } = todoData;
    
    try {
        const [result] = await db.pool.query(`
            UPDATE todos 
            SET 
                title = ?,
                content = ?,
                planned_time = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_task_id = ? AND user_id = ?
        `, [title, content, deadline, user_task_id, userId]);
        
        return result;
    } catch (error) {
        console.error('数据库更新失败:', error);
        throw error; 
    }
}
static async AddTodo(todoData) {
  const { userId, title, content, deadline } = todoData;

  const [rows] = await db.pool.query(
    'SELECT COALESCE(MAX(user_task_id),0) AS maxId FROM todos WHERE user_id=?',
    [userId]
  );
  const nextId = rows[0].maxId + 1;

  const [result] = await db.pool.query(
    `INSERT INTO todos (user_id,user_task_id,title,content,planned_time,is_completed)
     VALUES (?,?,?,?,?,0)`,
    [userId, nextId, title, content, deadline]
  );

  const [inserted] = await db.pool.query(
    `SELECT id,
            user_id AS userId,
            user_task_id AS userTaskId,
            title,
            content,
            planned_time AS deadline,
            is_completed AS ifFinish
     FROM todos
     WHERE id = ?`,
    [result.insertId]
  );
  return inserted[0];
}
}


module.exports = ListTodo;