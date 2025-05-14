<script setup>
import { ref } from 'vue';
import { ElInput, ElButton, ElForm, ElFormItem } from 'element-plus';

// 定义响应式变量来存储输入的bot_id和token
const botId = ref('7498558438617169955');
const token = ref('pat_Yplciyf7lx7S4TLDz4KaWTSaAIKd63JyVY2ZmdXmqxIT5aXJCe9hBtjjTGKaJ4pH');

// 异步加载脚本并执行代码
function loadScript(url, callback) {
  // 检查脚本是否已经加载
  if (document.querySelector(`script[src="${url}"]`)) {
    callback();
    return;
  }

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

function reloadBot() {
  loadScript('https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/cn/index.js', function () {
    const cozeWebSDK = new CozeWebSDK.WebChatClient({
      type: "app",
      config: {
        bot_id: botId.value,
      },
      componentProps: {
        title: 'Coze',
      },
      auth: {
        type: 'token',
        token: token.value,
        onRefreshToken: function () {
          return token.value;
        }
      },
      ui: {
        base: {
          lang: "zh-CN"
        }
      }
    });

    cozeWebSDK.showChatBot();
  });
}

// 初始加载bot
reloadBot();
</script>

<template>
  <el-form>
    <el-form-item label="Bot ID">
      <el-input v-model="botId" placeholder="请输入Bot ID" />
    </el-form-item>
    
    <el-form-item label="Token">
      <el-input v-model="token" placeholder="请输入Token" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="reloadBot">重新加载Bot</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>
