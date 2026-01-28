<template>
  <div class="login-container">
    <h1>登录界面</h1>
    <form @submit.prevent="handleLogin">
      <input
        type="text"
        placeholder="用户名或邮箱"
        v-model="loginForm.username"
        required
        @input="loginForm.username = loginForm.username.trim()"
      >
      <input
        type="password"
        placeholder="密码"
        v-model="loginForm.password"
        required
      >
      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
    <div class="button-container">
      <RouterLink to="/register" class="button">没有账号？去注册</RouterLink>
      <RouterLink to="/" class="button">返回首页</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../Store/Lstore'

const router = useRouter()
const authStore = useAuth()

const loginForm = ref({
  username: '',
  password: ''
})
const loading = ref(false)
const error = ref('')
let isMounted = true 

onBeforeUnmount(() => {
  isMounted = false
})

const handleLogin = async () => {
  const username = loginForm.value.username.trim()
  const password = loginForm.value.password.trim()
  
  if (!username || !password) {
    error.value = '请输入用户名和密码'
    return
  }

  try {
    loading.value = true
    error.value = ''
    
    const response = await authStore.login({
      username,
      password
    })
    
    if (!isMounted) return
    
    if (response?.success) {
    await router.push(`/main/${authStore.user.user_id}`);      

      loginForm.value = {
        username: '',
        password: ''
      }
    } else {
      error.value = response?.message || '登录失败，请检查凭证'
    }
  } catch (err) {
    if (!isMounted) return
    
    if (err.response) {
      error.value = err.response.data?.message || 
                  `服务器错误 (${err.response.status})`
    } else if (err.request) {
      error.value = '网络连接失败，请检查网络'
    } else {
      error.value = err.message || '发生未知错误'
    }
    
    console.error('登录错误详情:', {
      time: new Date().toISOString(),
      error: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      request: {
        username: loginForm.value.username,
        password: '***' 
      }
    })
  } finally {
    if (isMounted) {
      loading.value = false
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa876;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin: 0.5rem 0;
  text-align: center;
}

.button-container {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
}

.button {
  padding: 0.5rem 1rem;
  color: #42b983;
  text-decoration: none;
  border-radius: 4px;
  transition: color 0.3s;
}

.button:hover {
  color: #3aa876;
  text-decoration: underline;
}
</style>