import axios from 'axios';
import {createCachedAsyncFunction} from "@/common/utils";

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    const { token, user } = response.data;
    localStorage.setItem('token', token);
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

// 退出登录
export const logout = () => {
  localStorage.removeItem('token');
};