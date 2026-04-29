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
const imageInputRef = ref(null)
const videoInputRef = ref(null)
const previewUrlMap = new Map()

/** 获取验证码 */
const refreshCaptcha = async () => {
  const res = await getCaptcha()
  captcha.value = res
  captchaInput.value = ''
}

/** 生成文件唯一key（用于去重/删除） */
const getFileKey = (file) => {
  return `${file.name}__${file.size}__${file.lastModified}`
}

/** 获取预览URL（会缓存，避免重复创建ObjectURL） */
const getPreviewUrl = (file) => {
  const key = getFileKey(file)
  const existed = previewUrlMap.get(key)
  if (existed) return existed
  const url = URL.createObjectURL(file)
  previewUrlMap.set(key, url)
  return url
}

/** 释放预览URL（删除文件/重置时调用，避免内存泄漏） */
const revokePreviewUrl = (file) => {
  const key = getFileKey(file)
  const url = previewUrlMap.get(key)
  if (!url) return
  URL.revokeObjectURL(url)
  previewUrlMap.delete(key)
}

/** 清理所有预览URL */
const clearAllPreviewUrls = () => {
  for (const url of previewUrlMap.values()) {
    URL.revokeObjectURL(url)
  }
  previewUrlMap.clear()
}

/** 格式化文件大小 */
const formatSize = (bytes) => {
  if (!Number.isFinite(bytes)) return ''
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`
}

/** 选择图片 */
const onSelectImages = (e) => {
  const files = Array.from(e?.target?.files || [])
  if (!files.length) return

  const existed = new Set(imageFiles.value.map((f) => getFileKey(f)))
  const merged = [...imageFiles.value]
  for (const f of files) {
    const key = getFileKey(f)
    if (!existed.has(key)) {
      merged.push(f)
      existed.add(key)
    }
  }
  imageFiles.value = merged

  if (imageInputRef.value) {
    imageInputRef.value.value = ''
  }
}

/** 选择视频（最多5个） */
const onSelectVideos = (e) => {
  const files = Array.from(e?.target?.files || [])
  if (!files.length) return

  const existed = new Set(videoFiles.value.map((f) => getFileKey(f)))
  const merged = [...videoFiles.value]
  for (const f of files) {
    const key = getFileKey(f)
    if (!existed.has(key)) {
      merged.push(f)
      existed.add(key)
    }
  }

  if (merged.length > 5) {
    alert('最多上传5个视频')
  }
  videoFiles.value = merged.slice(0, 5)

  if (videoInputRef.value) {
    videoInputRef.value.value = ''
  }
}

/** 删除已选图片 */
const removeImage = (file) => {
  revokePreviewUrl(file)
  const key = getFileKey(file)
  imageFiles.value = imageFiles.value.filter((f) => getFileKey(f) !== key)
}

/** 删除已选视频 */
const removeVideo = (file) => {
  revokePreviewUrl(file)
  const key = getFileKey(file)
  videoFiles.value = videoFiles.value.filter((f) => getFileKey(f) !== key)
}

/** 上传图片（多文件） */
const uploadImages = async () => {
  if (!imageFiles.value.length) return { batchId: '', urls: [] }
  const fd = new FormData()
  imageFiles.value.forEach((f) => fd.append('images', f))
  const res = await api.post('/issue/upload/images', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0
  })
  return { batchId: res?.batchId || '', urls: res?.urls || [] }
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

/** 清理临时视频（用于提交失败回收） */
const cleanupTempVideos = async (tempIds) => {
  const ids = Array.isArray(tempIds) ? tempIds.filter(Boolean) : []
  if (!ids.length) return
  await api.post('/issue/upload/video-temp/cleanup', { tempIds: ids })
}

/** 清理图片批次（用于提交失败回收） */
const cleanupImageBatch = async (batchId) => {
  if (!batchId) return
  await api.delete(`/issue/upload/images/batch/${batchId}`)
}

/** 提取接口错误信息 */
const getErrorMessage = (err) => {
  const msg = err?.response?.data?.message
  if (Array.isArray(msg)) return msg.join('\n')
  if (typeof msg === 'string' && msg.trim()) return msg
  if (typeof err?.message === 'string' && err.message.trim()) return err.message
  return '提交失败'
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
  let imageBatchId = ''
  let uploadedImageUrls = []
  const uploadedVideoTempIds = []
  try {
    const imageUpload = await uploadImages()
    imageBatchId = imageUpload?.batchId || ''
    uploadedImageUrls = imageUpload?.urls || []

    for (const file of videoFiles.value) {
      const tempId = await uploadTempVideo(file)
      if (tempId) uploadedVideoTempIds.push(tempId)
    }

    const submitRes = await api.post('/issue/submit', {
      nickname: formData.value.nickname,
      question: formData.value.question,
      captchaId: captcha.value.captchaId,
      captcha: captchaInput.value,
      imageUrls: uploadedImageUrls,
      imageBatchId,
      videoTempIds: uploadedVideoTempIds
    })

    void submitRes
    alert('提交成功')
    formData.value = { nickname: '', question: '' }
    clearAllPreviewUrls()
    imageFiles.value = []
    videoFiles.value = []
    if (imageInputRef.value) imageInputRef.value.value = ''
    if (videoInputRef.value) videoInputRef.value.value = ''
    await refreshCaptcha()
  } catch (err) {
    try {
      await cleanupTempVideos(uploadedVideoTempIds)
    } catch {}
    try {
      await cleanupImageBatch(imageBatchId)
    } catch {}
    alert(getErrorMessage(err))
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
        <input ref="imageInputRef" class="form-file" type="file" accept="image/*" multiple @change="onSelectImages" />
        <div v-if="imageFiles.length" class="file-list">
          <div class="file-summary">已选择 {{ imageFiles.length }} 张</div>
          <div class="file-items">
            <div v-for="file in imageFiles" :key="getFileKey(file)" class="file-item">
              <img class="file-preview-image" :src="getPreviewUrl(file)" alt="preview" />
              <div class="file-name">{{ file.name }}</div>
              <div class="file-meta">{{ formatSize(file.size) }}</div>
              <button class="file-remove" type="button" @click="removeImage(file)">删除</button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-item">
        <label class="form-label">上传视频（最多5个，单个不超过200MB）</label>
        <input ref="videoInputRef" class="form-file" type="file" accept="video/*" multiple @change="onSelectVideos" />
        <div v-if="videoFiles.length" class="file-list">
          <div class="file-summary">已选择 {{ videoFiles.length }} 个</div>
          <div class="file-items">
            <div v-for="file in videoFiles" :key="getFileKey(file)" class="file-item">
              <video class="file-preview-video" :src="getPreviewUrl(file)" controls preload="metadata" />
              <div class="file-name">{{ file.name }}</div>
              <div class="file-meta">{{ formatSize(file.size) }}</div>
              <button class="file-remove" type="button" @click="removeVideo(file)">删除</button>
            </div>
          </div>
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

.file-summary {
  margin-bottom: 10px;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
}

.file-preview-image {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #e0e0e0;
  background: #fff;
  flex: 0 0 auto;
}

.file-preview-video {
  width: 96px;
  height: 54px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #e0e0e0;
  background: #000;
  flex: 0 0 auto;
}

.file-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
}

.file-meta {
  color: #999;
  white-space: nowrap;
}

.file-remove {
  border: none;
  background: #ff4d4f;
  color: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  white-space: nowrap;
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
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: #fafafa;
  :deep(svg){
    width: 100px;
    height:40px;
  }
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
