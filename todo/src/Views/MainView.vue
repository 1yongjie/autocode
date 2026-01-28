<template>
  <div class="todo-container">
    <div class="todo-header">
      <h1>今日事项</h1>
    </div>

    <div class="todo-count">
      <h2>今日总事项 {{ todoAll }} 项/还剩 {{ todoRemain }} 项</h2>
    </div>

    <div class="todo-list">
      <div v-if="todoAll === 0" class="empty-list">
        <h3>今日还没有事项，请添加</h3>
      </div>

      <table class="todo-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>标题</th>
            <th>具体内容</th>
            <th>截止时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="item in sortedTodos" 
            :key="item.userTaskId"
            :class="{
              completed: item.ifFinish,
              expired: isExpired(item.deadline) && !item.ifFinish
            }"
          >
            <td>{{ item.userTaskId }}</td>
            <td>
              <input 
                v-if="item.editing"
                v-model="editForm.title"
                class="edit-input"
              >
              <span v-else>{{ item.title }}</span>
            </td>
            <td>
              <input 
                v-if="item.editing"
                v-model="editForm.content"
                class="edit-input"
              >
              <span v-else>{{ item.content }}</span>
            </td>
            <td>
              <input
                v-if="item.editing"
                type="datetime-local"
                v-model="editForm.deadline"
              >
              <span v-else>{{ formatDate(item.deadline) }}</span>
            </td>
            <td>{{ item.ifFinish ? '已完成' : '未完成' }}</td>
            <td>
              <div class="action-buttons">
                <button
                v-if="!item.ifFinish"
                @click="item.editing ? saveEdit(item) : 
                finishTodo(item.userId, item.userTaskId)"
                >
                {{ item.editing ? '保存' : '完成' }}
                </button>
                <button 
                  v-if="item.ifFinish"
                  @click="deleteTodo(item.userId, item.userTaskId)"                 
                  class="delete-btn"
                >
                  删除
                </button>
                <button 
                  @click="toggleEdit(item)"
                  class="edit-btn"
                >
                  {{ item.editing ? '取消' : '编辑' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="todo-add">
      <input 
        v-model="newTodo.title"
        class="add-input"
        placeholder="事项标题"
      >
      <input 
        v-model="newTodo.content"
        class="add-input"
        placeholder="具体内容"
      >
      <input
        type="datetime-local"
        v-model="newTodo.deadline"
        class="add-input"
      >
      <button @click="addTodo" class="add-btn">添加事项</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { UseTodo } from '../Store/Store.js';

const route = useRoute();
const {
  loadTodos,
  todos,
  newTodo,
  editForm,
  todoAll,
  todoRemain,
  sortedTodos,
  isExpired,
  formatDate,
  deleteTodo,
  finishTodo,
  toggleEdit,
  saveEdit,
  addTodo
} = UseTodo();

onMounted(() => {
  const uid = Number(route.params.userId);
  loadTodos(uid).then(() => {
    console.log('加载完毕，todos =', todos.value);
  });
});
</script>

<style scoped>
.todo-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.todo-header {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.todo-header h1 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 600;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.todo-count {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #7f8c8d;
}

.todo-count h2 {
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
}

.empty-list {
  text-align: center;
  padding: 2rem;
  color: #95a5a6;
  font-style: italic;
}

.todo-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.todo-table th {
  background-color: #3498db;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.todo-table td {
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.todo-table tr:not(:last-child) td {
  border-bottom: 1px solid #ecf0f1;
}

.todo-table tr:hover td {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.completed {
  background-color: rgba(46, 204, 113, 0.08);
  color: #27ae60;
}

.expired {
  background-color: rgba(231, 76, 60, 0.08);
  color: #e74c3c;
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: inherit;
  transition: border 0.2s;
}

.edit-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.finish-btn {
  background-color: #2ecc71;
  color: white;
}

.finish-btn:hover {
  background-color: #27ae60;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.save-btn {
  background-color: #f39c12;
  color: white;
}

.save-btn:hover {
  background-color: #d35400;
}

.todo-add {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  align-items: center;
}

.add-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
}

.add-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.add-btn {
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
}

.add-btn:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
}

input[type="datetime-local"] {
  padding: 0.75rem;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  font-family: inherit;
  transition: all 0.2s;
}

input[type="datetime-local"]:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

@media (max-width: 768px) {
  .todo-add {
    flex-direction: column;
  }
  
  .add-input {
    width: 100%;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>