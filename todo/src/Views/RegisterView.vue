<template>
  <div class="register-container">
    <h1>注册界面</h1>
    <form @submit.prevent="handleRegister">
      <input 
        type="text" 
        placeholder="用户名" 
        v-model="registerForm.username"
        required
      >
      <input 
        type="email" 
        placeholder="邮箱" 
        v-model="registerForm.email"
        required
      >
      <input 
        type="password" 
        placeholder="密码" 
        v-model="registerForm.password"
        required
      >
      <input 
        type="password" 
        placeholder="确认密码" 
        v-model="registerForm.confirmPassword"
        required
      >
      <button type="submit" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
    <div class="button-container">
      <RouterLink to="/login" class="button">已有账号？去登录</RouterLink>
      <RouterLink to="/" class="button">返回首页</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../Store/Lstore';

const router = useRouter();
const authStore = useAuth();

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const loading = ref(false);
const error = ref('');

const validateForm = () => {
  if (!registerForm.value.username || 
      !registerForm.value.email || 
      !registerForm.value.password) {
    error.value = '请填写所有必填字段';
    return false;
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    error.value = '两次输入的密码不一致';
    return false;
  }

  if (registerForm.value.password.length < 6) {
    error.value = '密码长度不能少于6位';
    return false;
  }

  return true;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    error.value = '';
    
    // 直接调用store的register方法，传递必要参数
    await authStore.register(
      registerForm.value.username.trim(),
      registerForm.value.email.trim(),
      registerForm.value.password
    );
    
    // 注册成功后跳转
    router.push('/login');
  } catch (err) {
    error.value = err.message || '注册失败，请稍后重试';
    console.error('注册错误:', err);
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped>
.register-container {
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