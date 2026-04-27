<script setup>
import { onMounted, ref } from 'vue'
import { api, getCaptcha } from '@/api/server'

const formData = ref({
  nickname: '',
  question: ''
})

const isSubmitting = ref(false)

const captcha = ref({
  captchaId: '',
  svg: ''
})
const captchaInput = ref('')

const imageFiles = ref([])
const videoFiles = ref([])

/** 获取验证码 */
const refreshCaptcha = async () => {
  const res = await getCaptcha()
  captcha.value = res
  captchaInput.value = ''
}

/** 选择图片 */
const onSelectImages = (e) => {
  const files = Array.from(e?.target?.files || [])
  imageFiles.value = files
}

/** 选择视频（最多5个） */
const onSelectVideos = (e) => {
  const files = Array.from(e?.target?.files || [])
  videoFiles.value = files.slice(0, 5)
  if (files.length > 5) {
    alert('最多上传5个视频')
  }
}

/** 上传图片（多文件） */
const uploadImages = async () => {
  if (!imageFiles.value.length) return []
  const fd = new FormData()
  imageFiles.value.forEach((f) => fd.append('images', f))
  const res = await api.post('/issue/upload/images', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0
  })
  return res?.urls || []
}

/** 上传单个视频到临时缓存 */
const uploadTempVideo = async (file) => {
  const fd = new FormData()
  fd.append('video', file)
  const res = await api.post('/issue/upload/video-temp', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0
  })
  return res?.tempId
}

/** 提交表单：视频先传完再一次性提交 */
const submitForm = async () => {
  if (isSubmitting.value) return
  if (!formData.value.nickname?.trim()) {
    alert('请填写昵称')
    return
  }
  if (!formData.value.question?.trim()) {
    alert('请填写详细问题')
    return
  }
  if (!captcha.value.captchaId) {
    alert('验证码加载失败，请刷新')
    return
  }
  if (!captchaInput.value?.trim()) {
    alert('请输入验证码')
    return
  }

  isSubmitting.value = true
  try {
    const imageUrls = await uploadImages()

    const videoTempIds = []
    for (const file of videoFiles.value) {
      const tempId = await uploadTempVideo(file)
      if (tempId) videoTempIds.push(tempId)
    }

    await api.post('/issue/submit', {
      nickname: formData.value.nickname,
      question: formData.value.question,
      captchaId: captcha.value.captchaId,
      captcha: captchaInput.value,
      imageUrls,
      videoTempIds
    })

    alert('提交成功')
    formData.value = { nickname: '', question: '' }
    imageFiles.value = []
    videoFiles.value = []
    await refreshCaptcha()
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  refreshCaptcha()
})
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

      <div class="form-item">
        <label class="form-label">上传图片（单张不超过10MB）</label>
        <input class="form-file" type="file" accept="image/*" multiple @change="onSelectImages" />
        <div v-if="imageFiles.length" class="file-list">
          已选择 {{ imageFiles.length }} 张
        </div>
      </div>

      <div class="form-item">
        <label class="form-label">上传视频（最多5个，单个不超过200MB）</label>
        <input class="form-file" type="file" accept="video/*" multiple @change="onSelectVideos" />
        <div v-if="videoFiles.length" class="file-list">
          已选择 {{ videoFiles.length }} 个
        </div>
      </div>

      <div class="form-item">
        <label class="form-label">验证码</label>
        <div class="captcha-row">
          <div class="captcha-svg" v-html="captcha.svg"></div>
          <button class="captcha-refresh" type="button" @click="refreshCaptcha">刷新</button>
        </div>
        <input
          v-model="captchaInput"
          type="text"
          class="form-input"
          placeholder="请输入验证码"
          maxlength="10"
        />
      </div>

      <button class="submit-btn" @click="submitForm">
        {{ isSubmitting ? '提交中...' : '提交' }}
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

.form-file {
  width: 100%;
}

.file-list {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.captcha-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.captcha-svg {
  flex: 1;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: #fafafa;
}

.captcha-refresh {
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  background: #667eea;
  color: #fff;
  cursor: pointer;
}
</style>
