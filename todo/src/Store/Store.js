import { ref, computed, reactive } from 'vue'
import axios from 'axios'
import { useAuth } from './Lstore';

const api=axios.create({
  baseURL: 'http://localhost:3000/api/List', 
  timeout: 5000
})

export function UseTodo() {
  const auth = useAuth();

  const newTodo = reactive({
    userId: computed(() => auth.user?.user_id ?? null),
    title: '',
    content: '',
    deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  })

  const editForm = reactive({
    title: '',
    content: '',
    deadline: ''
  })

  const todos = ref([])
  const loading = ref(false) 
  const error = ref(null) 

  const todoAll = computed(() => todos.value.length)
  const todoRemain = computed(() => todos.value.filter(t => !t.ifFinish).length)
  const sortedTodos = computed(() => [...todos.value].sort((a,b) => new Date(a.deadline) - new Date(b.deadline)))

async function loadTodos(userId) {
  try {
    loading.value = true;
    const response = await api.get(`/todos/${userId}`);
    todos.value = response.data.data.map(todo => ({
      ...todo,
      editing: false
    }));
  } catch (err) {
    error.value = err.message;
    console.error('加载Todos失败:', err);
  } finally {
    loading.value = false;
  }
}

  async function deleteTodo(userId,userTaskId) {
     try {
        await api.delete(`/todos/${userId}/${userTaskId}`);
        todos.value = todos.value.filter(t => !(t.userId === userId && t.userTaskId === userTaskId)
        );
        
    } catch (err) {
      error.value = err.message
      console.error('删除Todo失败:', err)
    }
  }

  async function finishTodo(userId, userTaskId) {
  try {
    await api.patch(
      `/todos/${userId}/${userTaskId}/finish`, 
      { ifFinish: true }
    );

    const todo = todos.value.find(todo => 
      todo.userId === userId && todo.userTaskId === userTaskId
    );
    if (todo) {
      todo.ifFinish = true;
    }
  } catch (err) {
    error.value = err.message;
    console.error('修改完成状态失败:', err);
  }
}

  async function saveEdit(todo) {  
  try {
    await api.put(`/todos/${todo.userTaskId}`, {
      userId: todo.userId,  
      title: editForm.title,
      content: editForm.content,
      deadline: editForm.deadline
    });

    Object.assign(todo, {
      title: editForm.title,
      content: editForm.content,
      deadline: editForm.deadline,
      editing: false
    });
  } catch (err) {
    console.error('保存失败:', err);
  }
}


  async function addTodo() {
  
    if (!newTodo.title.trim()) {
      alert('请填写事项标题')
      return
    }
    
    try {
      const todoData = {
        userId:newTodo.userId,
        title: newTodo.title,
        content: newTodo.content || '无具体内容',
        deadline: newTodo.deadline || new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      }
      
      const response = await api.post('/todos', todoData)
      
      todos.value.push({
        ...response.data,
        editing: false
      })

      newTodo.title = ''
      newTodo.content = ''
      newTodo.deadline = new Date(Date.now() + 86400000).toISOString().slice(0, 16)
    } catch (err) {
      error.value = err.message
      console.error('添加Todo失败:', err)
    }
  }

  function toggleEdit(todo) {
  todos.value.forEach(t => t.editing = false);
  
  if (!todo.editing) {
    Object.assign(editForm, {
      title: todo.title,
      content: todo.content,
      deadline: todo.deadline.slice(0, 16) 
    });
    todo.editing = true;
  }
}
  
  function isExpired(deadline) {
    return new Date(deadline) < new Date()
  }

  function formatDate(dateString) {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleString('zh-CN', options)
  }
  
  

  return {
    newTodo,
    editForm,
    todos,
    todoAll,
    todoRemain,
    sortedTodos,
    isExpired,
    formatDate,
    loadTodos,
    deleteTodo,
    finishTodo,
    toggleEdit,
    saveEdit,
    addTodo
  }

  }