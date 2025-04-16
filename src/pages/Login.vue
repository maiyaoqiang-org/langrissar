<template>
  <div class="login-container">
    <div class="login-box">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="登录" name="login">
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
            <el-form-item prop="phone">
              <el-input 
                v-model="loginForm.phone" 
                placeholder="请输入手机号">
                <template #prefix>
                  <el-icon><Iphone /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码">
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
                <template #suffix>
                  <el-icon class="cursor-pointer" @click="showPassword = !showPassword">
                    <View v-if="showPassword" />
                    <Hide v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="captcha">
              <div class="captcha-container">
                <el-input 
                  v-model="loginForm.captcha" 
                  placeholder="请输入验证码">
                </el-input>
                <div class="captcha-image" v-html="captchaSvg" @click="refreshCaptcha"></div>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleLogin" :loading="loading" class="submit-button">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
            <el-form-item prop="phone">
              <el-input 
                v-model="registerForm.phone" 
                placeholder="请输入手机号">
                <template #prefix>
                  <el-icon><Iphone /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input 
                v-model="registerForm.password" 
                :type="showRegisterPassword ? 'text' : 'password'"
                placeholder="请输入密码">
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
                <template #suffix>
                  <el-icon class="cursor-pointer" @click="showRegisterPassword = !showRegisterPassword">
                    <View v-if="showRegisterPassword" />
                    <Hide v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="invitationCode">
              <el-input 
                v-model="registerForm.invitationCode" 
                placeholder="请输入邀请码">
                <template #prefix>
                  <el-icon><Key /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="captcha">
              <div class="captcha-container">
                <el-input 
                  v-model="registerForm.captcha" 
                  placeholder="请输入验证码">
                </el-input>
                <div class="captcha-image" v-html="captchaSvg" @click="refreshCaptcha"></div>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleRegister" :loading="registerLoading" class="submit-button">
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { Iphone, Lock, Key, View, Hide } from '@element-plus/icons-vue'
import { login, register, getCaptcha } from '@/api/server';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'Login',
  components: {
    Iphone,
    Lock,
    Key,
    View,
    Hide
  },
  setup() {
    const userStore = useUserStore()
    const route = useRoute()
    const router = useRouter()
console.log(666,userStore,userStore.isAuthenticated);

    // 如果已登录，重定向到目标页面或首页
    if (userStore.isAuthenticated) {
      const redirectPath = route.query.redirect || '/pages/ddjsq-el'
      router.replace(redirectPath)
    }
  },
  data() {
    return {
      activeTab: 'login',
      loginForm: {
        phone: '',
        password: '',
        captcha: ''
      },
      registerForm: {
        phone: '',
        password: '',
        invitationCode: '',
        captcha: ''
      },
      useCaptcha: false,
      loading: false,
      registerLoading: false,
      loginCountdown: 0,
      registerCountdown: 0,
      loginRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 4, message: '验证码长度应为4位', trigger: 'blur' }
        ]
      },
      registerRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        invitationCode: [
          { required: true, message: '请输入邀请码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 4, message: '验证码长度应为4位', trigger: 'blur' }
        ]
      },
      captchaSvg: '',
      registerCaptchaSvg: '',
      captchaId: '',
      registerCaptchaId: '',
      showPassword: false,
      showRegisterPassword: false,
    };
  },
  created() {
    // 页面创建时获取验证码
    this.refreshCaptcha();
  },
  methods: {
    async handleLogin() {
      try {
        await this.$refs.loginForm.validate();
        this.loading = true;
        
        const loginData = {
          phone: this.loginForm.phone,
          password: this.loginForm.password,
          captcha: this.loginForm.captcha,
          captchaId: this.captchaId
        };
        
        const result = await login(loginData);
        this.$message.success('登录成功');
        
        const userStore = useUserStore()
        userStore.setUser({
          id: result.id,
          phone: result.phone,
          role: result.role,
          token: result.access_token,
          expireIn: result.expireIn
        });
        
        // 获取重定向地址并进行安全验证
        let redirect = this.$route.query.redirect || '/';
        // 确保重定向地址以/开头，防止恶意跳转
        if (!redirect.startsWith('/')) {
          redirect = '/';
        }
        this.$router.push(redirect);
      } catch (error) {
        this.$message.error(error.message || '登录失败');
        this.refreshCaptcha(); // 登录失败时刷新验证码
      } finally {
        this.loading = false;
      }
    },
    
    async handleRegister() {
      try {
        await this.$refs.registerForm.validate();
        this.registerLoading = true;
        
        const registerData = {
          ...this.registerForm,
          captchaId: this.captchaId
        };
        
        await register(registerData);
        this.$message.success('注册成功');
        
        this.$refs.registerForm.resetFields();
        this.activeTab = 'login';
        this.refreshCaptcha(); // 注册成功后刷新验证码
      } catch (error) {
        this.$message.error(error.message || '注册失败');
      } finally {
        this.registerLoading = false;
      }
    },
    
    async refreshCaptcha() {
      try {
        const result = await getCaptcha();
        this.captchaSvg = result.svg;
        this.captchaId = result.captchaId;
      } catch (error) {
        this.$message.error(error.message || '获取验证码失败');
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login-box {
  width: 400px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.captcha-container {
  display: flex;
  gap: 10px;
}

.submit-button {
  width: 100%;
}

.login-type {
  text-align: right;
  margin-bottom: 20px;
}

.el-tabs__nav {
  width: 100%;
  display: flex;
}

.el-tabs__item {
  flex: 1;
  text-align: center;
}

.captcha-image {
  width: 100px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.captcha-image :deep(svg) {
  width: 100%;
  height: 100%;
}
.cursor-pointer {
  cursor: pointer;
}
</style>