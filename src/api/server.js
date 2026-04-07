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
export const getPredayReward = async (accountIds) => {
  return await api.post('/account/get-preday-reward', { accountIds });
};

// 获取每周福利
export const getWeeklyReward = async (accountIds) => {
  return await api.post('/account/get-weekly-reward', { accountIds });
};

// 获取每月福利
export const getMonthlyReward = async (accountIds) => {
  return await api.post('/account/get-monthly-reward', { accountIds });
};

// 获取CDKey奖励
export const getCdkeyReward = async (cdkey, accountIds) => {
  return await api.post('/account/get-cdkey-reward', { cdkey, accountIds });
};

export const getCdkeyRewardForAccount = async (cdkey, accountId) => {
  return await api({
    url: `/account/get-cdkey-reward-for-account`,
    method: 'get',
    params: {
      cdkey,
      accountId
    },
  });
};

// 自动获取CDKey奖励
export const autoCdkeyReward = async (accountIds) => {
  return await api.post('/account/auto-cdkey-reward', { accountIds });
};

export const autoVIPWeeklyReward = async (accountIds) => {
  return await api.post('/account/auto-vip-weekly-reward', { accountIds });
};

export const autoVIPMonthlyReward = async (accountIds) => {
  return await api.post('/account/auto-vip-monthly-reward', { accountIds });
};

export const autoVIPSignReward = async (accountIds) => {
  return await api.post('/account/auto-vip-sign-reward', { accountIds });
};

export const runCurlTemplate = async (curl, accountIds) => {
  return await api.post('/account/run-curl-template', { curl, accountIds });
};

// 清除CDKey缓存
export const clearCdkeyCache = async () => {
  return await api.get('/account/clear-cdkey-cache');
};

export const setAccountStatus = async (id, status) => {
  return await api.put(`/account/${id}/status`, { status });
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

// 获取紫龙游戏列表（HomeGameList）
export const getHomeGameList = async () => {
  return await api.get('/account/home-game-list');
};


// used-cdkey相关接口
// 在used-cdkey相关API部分添加分页参数

// 获取所有使用记录（带分页）
export const getUsedCdkeys = (page = 1, limit = 10, cdkey = null) => {
  const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (cdkey) {
      params.append('cdkey', cdkey);
    }
    
    return api.get(`/used-cdkeys?${params}`);
}


// 创建新的使用记录
export const createUsedCdkey = async (cdkey) => {
  return await api.post('/used-cdkeys', { cdkey });
};

// 根据ID获取单条记录
export const getUsedCdkeyById = async (id) => {
  return await api.get(`/used-cdkeys/${id}`);
};


// 更新记录
export const updateUsedCdkey = async (id, cdkey) => {
  return await api.put(`/used-cdkeys/${id}`, { cdkey });
};

// 删除记录
export const deleteUsedCdkey = async (id) => {
  return await api.delete(`/used-cdkeys/${id}`);
};

// 检查CDKEY是否已使用
export const checkCdkeyUsed = async (cdkey) => {
  return await api.get(`/used-cdkeys/check/${cdkey}`);
};

// 定时任务相关接口
// 分页查询定时任务
export const queryCronJobs = async (data) => {
  return await api.get('/cron-job', { params: data });
};

// 创建定时任务
export const createCronJob = async (data) => {
  return await api.post('/cron-job', data);
};

// 更新定时任务
export const updateCronJob = async (id, data) => {
  return await api.put(`/cron-job/${id}`, data);
};

// 删除定时任务
export const deleteCronJob = async (id) => {
  return await api.delete(`/cron-job/${id}`);
};

// 切换任务状态
export const toggleCronJobStatus = async (id) => {
  return await api.put(`/cron-job/${id}/toggle`);
};

// 手动执行任务
export const executeCronJob = async (id) => {
  return await api.post(`/cron-job/${id}/execute`);
};

// 获取任务统计信息
export const getCronJobStats = async (id) => {
  return await api.get(`/cron-job/${id}/stats`);
};

// 查询执行日志
export const queryCronJobLogs = async (data) => {
  return await api.get('/cron-job/logs/list', { params: data });
};

// 验证cron表达式
export const validateCronExpression = async (expression) => {
  return await api.post('/cron-job/validate-cron', { expression });
};

// 自定义内容相关接口
// 分页查询自定义内容
export const queryCustomContent = async (data) => {
  return await api.get('/custom-content', { params: data });
};

// 创建自定义内容
export const createCustomContent = async (data) => {
  return await api.post('/custom-content', data);
};

// 根据ID获取自定义内容
export const getCustomContent = async (id) => {
  return await api.get(`/custom-content/detail/${id}`);
};

// 更新自定义内容
export const updateCustomContent = async (id, data) => {
  return await api.put(`/custom-content/${id}`, data);
};

// 删除自定义内容
export const deleteCustomContent = async (id) => {
  return await api.delete(`/custom-content/${id}`);
};

// 切换启用/停用状态
export const toggleCustomContent = async (id) => {
  return await api.put(`/custom-content/${id}/toggle`);
};
