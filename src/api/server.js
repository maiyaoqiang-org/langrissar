import axios from 'axios';
import { useUserStore } from '@/stores/user';
import router from '@/router';

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(config => {
  const userStore = useUserStore();
  const token = userStore.currentUser?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import { ElMessage } from 'element-plus';

// 响应拦截器 - 统一处理返回格式和错误信息
api.interceptors.response.use(
  response => {
    const { code, message, data } = response.data;
    if (code === 0) {
      return data;
    } else {
      ElMessage.error(message);
      return Promise.reject(new Error(message));
    }
  },
  error => {
    if (error.response?.status === 401) {
      // 清除用户状态
      const userStore = useUserStore();
      userStore.clearUser();
      
      // 确保router对象已初始化
      if (router && router.currentRoute.value.path !== '/pages/login') {
        router.push({
          path: '/pages/login',
          query: { redirect: router.currentRoute.value.fullPath }
        });
      }
    }
    const message = error.response?.data?.message || '请求失败';
    ElMessage.error(message);
    return Promise.reject(error);
  }
);

// 用户注册
export const register = async (userData) => {
  return await api.post('/user/register', userData);
};

// 用户登录
export const login = async (loginData) => {
  return await api.post('/user/login', loginData);
};

// 获取验证码
export const getCaptcha = async () => {
  return await api.get(`/user/captcha`);
};

// 创建邀请码
export const createInvitationCodes = async (count) => {
  return await api.post('/user/invitation-code', { count });
};

// 分页查询邀请码
export const queryInvitationCodes = async (data) => {
  return await api.post('/user/invitation-code/query', data);
};

// 退出登录
export const logout = () => {
  const userStore = useUserStore();
  userStore.clearUser();
};

// 修改密码
export const updatePassword = async (data) => {
  return await api.post('/user/update-password', data);
};

// 获取用户列表
export const getUsers = async (data) => {
  return await api.post('/user/query',data);
};

// 添加新用户
export const createUser = async (userData) => {
  return await api.post('/user/create', userData);
};

// 更新用户信息
export const updateUser = async (userData) => {
  return await api.post('/user/update', userData);
};

// 修改密码
export const changePassword = async (data) => {
  return await api.post('/user/change-password', data);
};