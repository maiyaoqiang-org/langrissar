import axios from 'axios';
import {createCachedAsyncFunction} from "@/common/utils";
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

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

// 响应拦截器 - 处理401未授权
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 清除用户状态
      const userStore = useUserStore();
      userStore.clearUser();
      
      // 跳转到登录页
      const router = useRouter();
      router.push({
        path: '/pages/login',
        query: { redirect: router.currentRoute.value.fullPath }
      });
    }
    return Promise.reject(error);
  }
);

// 用户注册
export const register = async (userData) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 用户登录
export const login = async (loginData) => {
  try {
    const response = await api.post('/user/login', loginData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 获取验证码
export const getCaptcha = async () => {
  try {
    const response = await api.get(`/user/captcha`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 创建邀请码
export const createInvitationCodes = async (count) => {
  try {
    const response = await api.post('/user/invitation-code', { count });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 分页查询邀请码
export const queryInvitationCodes = async (data) => {
  try {
    const response = await api.post('/user/invitation-code/query', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 退出登录
export const logout = () => {
  const userStore = useUserStore();
  userStore.clearUser();
};

// 修改密码
export const updatePassword = async (data) => {
  try {
    const response = await api.post('/user/update-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 获取用户列表
export const getUsers = async (data) => {
  try {
    const response = await api.post('/user/query',data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 添加新用户
export const createUser = async (userData) => {
  try {
    const response = await api.post('/user/create', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 更新用户信息
export const updateUser = async (userData) => {
  try {
    const response = await api.post('/user/update', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 修改密码
export const changePassword = async (data) => {
  try {
    const response = await api.post('/user/change-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};