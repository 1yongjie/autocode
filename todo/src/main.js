import { createApp } from 'vue';
import { createPinia } from 'pinia'; // 1. 先导入 Pinia
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from './Store/Lstore';

import App from './App.vue';
import HelloView from './Views/HelloView.vue';
import MainView from './Views/MainView.vue';
import LoginView from './Views/LoginView.vue';
import RegisterView from './Views/RegisterView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/main/:userId(\\d+)', 
    name: 'Main',
    component: MainView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

router.beforeEach(async (to, from, next) => {
  const authStore = useAuth(); // 此时 Pinia 已初始化
  const isAuthenticated = authStore.isAuthenticated;
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use(router);
app.mount('#app');