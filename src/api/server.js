import axios from 'axios';
import { useUserStore } from '@/stores/user';
import router from '@/router';
// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || '/api',
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
      if (response.config && response.config.resolveAll) {
        return response.data; // 直接返回原始响应数据
      }
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

export {
  api
}

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
  return await api.post('/user/query', data);
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

// 获取账号列表
export const getAccounts = async (data) => {
  return await api.post('/account/query', data);
};

// 添加账号
export const createAccount = async (accountData) => {
  return await api.post('/account', accountData);
};

// 更新账号
export const updateAccount = async (accountData) => {
  return await api.put(`/account/${accountData.id}`, accountData);
};

// 删除账号
export const deleteAccount = async (id) => {
  return await api.delete(`/account/${id}`);
};

// 获取每日福利
export const getPredayReward = async () => {
  return await api.get('/account/get-preday-reward');
};

// 获取每周福利
export const getWeeklyReward = async () => {
  return await api.get('/account/get-weekly-reward');
};

// 获取每月福利
export const getMonthlyReward = async () => {
  return await api.get('/account/get-monthly-reward');
};

// 获取CDKey奖励
export const getCdkeyReward = async (cdkey) => {
  return await api({
    url: `/account/get-cdkey-reward`,
    method: 'get',
    params: {
      cdkey
    },
  });
};

// 自动获取CDKey奖励
export const autoCdkeyReward = async () => {
  return await api.get('/account/auto-cdkey-reward');
};

export const autoVIPWeeklyReward = async () => {
  return await api.get('/account/auto-vip-weekly-reward');
};

export const autoVIPMonthlyReward = async () => {
  return await api.get('/account/auto-vip-monthly-reward');
};

export const autoVIPSignReward = async () => {
  return await api.get('/account/auto-vip-sign-reward');
};

// 清除CDKey缓存
export const clearCdkeyCache = async () => {
  return await api.get('/account/clear-cdkey-cache');
};


export const getRoleInfo = async (params) => {
  return await api({
    url: `/account/get-role-info`,
    method: 'get',
    params: {
      roleid: params.roleid
    }
  });
};

// Coze相关接口
// 分页查询Coze配置
export const queryCoze = async (data) => {
  return await api.post('/coze/query', data);
};

// 创建Coze配置
export const createCoze = async (data) => {
  return await api.post('/coze', data);
};

// 更新Coze配置
export const updateCoze = async (id, data) => {
  return await api.put(`/coze/${id}`, data);
};

// 删除Coze配置
export const deleteCoze = async (id) => {
  return await api.delete(`/coze/${id}`);
};

// OpenAI相关接口
// 分页查询OpenAI配置
export const queryOpenAI = async (data) => {
  return await api.post('/openai/query', data);
};

// 创建OpenAI配置
export const createOpenAI = async (data) => {
  return await api.post('/openai', data);
};

// 更新OpenAI配置
export const updateOpenAI = async (id, data) => {
  return await api.put(`/openai/${id}`, data);
};

// 删除OpenAI配置
export const deleteOpenAI = async (id) => {
  return await api.delete(`/openai/${id}`);
};

// 分页查询OpenAI聊天记录
export const queryOpenAIChatRecords = async (data) => {
  return await api.post('/openai/chat-records/query', data);
};

// 导出OpenAI聊天记录
export const exportOpenAIChatRecords = async (data) => {
  return await api({
    url: '/openai/chat-records/export',
    method: 'POST',
    responseType: 'blob', // 必须设置为 blob 才能正确处理文件下载
    data: data, // 将过滤条件发送给后端
    resolveAll: true,
  });
};

// 删除OpenAI聊天记录
export const deleteOpenAIChatRecord = async (id) => {
  return await api.delete(`/openai/chat-records/${id}`);
};

// zlvip相关接口
export const createZlVip = async (data) => {
  return await api.post('/account/zlvip', data);
};

export const updateZlVip = async (id, data) => {
  return await api.put(`/account/zlvip/${id}`, data);
};

export const deleteZlVip = async (id) => {
  return await api.delete(`/account/zlvip/${id}`);
};

export const queryZlVips = async (data) => {
  return await api.post('/account/zlvip/query', data);
};

export const getVipHomeGameList = async (data) => {
  return await api({
    url:'/account/getVipHomeGameList',
    method:'get',
    params:data,
  });
};

export const queryRoleList = async (data) => {
  return await api({
    url:'/account/queryRoleList',
    method:'get',
    params:data,
  });
};