<template>
  <div class="home-container" v-if="$route.path === '/'">
    <h1>待办系统</h1>
    <div class="button-container">
      <RouterLink to="/login" class="button">登录</RouterLink>
      <RouterLink to="/register" class="button">注册</RouterLink>
    </div>
  </div>
  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  components: {
    RouterLink,
    RouterView
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.button-container {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.button {
  display: inline-block;
  padding: 15px 30px;
  font-size: 18px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  min-width: 120px;
  transition: all 0.3s ease;
}

.button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>