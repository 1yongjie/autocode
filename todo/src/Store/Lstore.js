import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  timeout: 5000
});

export const useAuth = defineStore('auth', () => {
  const router = useRouter();
  
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const error = ref(null);
  
  const loginForm = ref({
    username: '',
    password: ''
  });
  
  const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const isAuthenticated = computed(() => !!token.value);

  function init() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(localStorage.getItem('user'));
        authApi.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error('初始化失败:', err);
        logout();
      }
    }
  }

  async function testConnection() {
    try {
      const response = await authApi.get('/test-connection');
      return response.data;
    } catch (err) {
      console.error('连接测试失败:', err);
      return {
        success: false,
        message: '无法连接到后端服务'
      };
    }
  }

  async function login(credentials) {
  
    try {  
      loading.value = true;
      error.value = null;

      const response = await authApi.post('/login', 
        JSON.stringify(credentials),
      {
        headers:{'Content-Type':'application/json'},
        withCredentials: true 
      }
    );
      
      if (!response.data?.success || !response.data.token) {
        throw new Error(response.data?.message || '登录失败: 无效的响应数据');
      }
      
      user.value = response.data.user;
      token.value = response.data.token;
      
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      authApi.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      
      loginForm.value = { username: '', password: '' };
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '登录失败';
      console.error('登录错误:', err);
      
      if (err.response?.status === 401) {
        logout();
      }
      
      throw err; 
    } finally {
      loading.value = false;
    }
  }

  async function register(username, email, password) {
  try {    
    const response = await authApi.post('/register', {
      username: username,
      email: email,
      password: password
    }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true 
    });
    
    if (!response.data?.success || !response.data.token) {
      throw new Error(response.data?.message || '注册失败: 无效的响应数据');
    }
    
    user.value = response.data.user;
    token.value = response.data.token;
    
    localStorage.setItem('token', token.value);
    localStorage.setItem('user', JSON.stringify(user.value));
    authApi.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    
    return response.data;
  } catch (err) {
    console.error('注册错误:', err);
    throw err; 
  }
}

  function logout() {
    user.value = null;
    token.value = null;
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete authApi.defaults.headers.common['Authorization'];
    
    if (router.currentRoute.value.meta.requiresAuth) {
      router.push('/login');
    }
  }

  function checkAuth() {
    if (token.value) {
      return true;
    }
    return false;
  }

  init();

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    loginForm,
    registerForm,
    
    init,
    testConnection,
    login,
    register,
    logout,
    checkAuth
  };
});