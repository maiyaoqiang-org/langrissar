<script setup>
import { ref } from 'vue'

const formData = ref({
  nickname: '',
  question: ''
})

const submitForm = () => {
  console.log('表单数据:', formData.value)
  console.log('昵称:', formData.value.nickname)
  console.log('详细问题:', formData.value.question)
}
</script>

<template>
  <div class="mobile-form-container">
    <div class="form-header">
      <h2>问题反馈</h2>
      <p>请填写您的信息，我们会尽快处理</p>
    </div>

    <div class="form-content">
      <div class="form-item">
        <label class="form-label">昵称</label>
        <input
          v-model="formData.nickname"
          type="text"
          class="form-input"
          placeholder="请输入您的昵称"
          maxlength="50"
        />
      </div>

      <div class="form-item">
        <label class="form-label">详细问题</label>
        <textarea
          v-model="formData.question"
          class="form-textarea"
          placeholder="请详细描述您遇到的问题"
          rows="6"
          maxlength="500"
        ></textarea>
        <div class="char-count">
          {{ formData.question.length }}/500
        </div>
      </div>

      <button class="submit-btn" @click="submitForm">
        提交
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
div{
    box-sizing: border-box;
}
.mobile-form-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-header {
  text-align: center;
  color: white;
  margin-top: 12px;
  margin-bottom: 24px;

  h2 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    opacity: 0.9;
  }
}

.form-content {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.form-item {
  margin-bottom: 25px;
  position: relative;
}

.form-label {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
  outline: none;
  background: #fafafa;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #aaa;
}

.form-textarea {
  resize: none;
  line-height: 1.5;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.submit-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
}
</style>
