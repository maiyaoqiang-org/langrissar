<script setup>
import { computed, onMounted, ref } from 'vue'
import { api, getCaptcha } from '@/api/server'
import { marked } from 'marked'

const formData = ref({
  nickname: '',
  question: ''
})

const isSubmitting = ref(false)

/** V2 上传进度状态 */
const uploadProgress = ref({
  phase: 'idle', // 'idle' | 'verifying' | 'uploading' | 'processing' | 'submitting'
  current: 0,
  total: 0,
  fileName: '',
  percent: 0,
})

/** 遮罩提示文案 */
const maskMessage = computed(() => {
  const p = uploadProgress.value
  if (p.phase === 'verifying') return '正在验证验证码...'
  if (p.phase === 'uploading') {
    return `正在上传第 ${p.current}/${p.total} 个文件（${p.fileName}）... ${p.percent}%`
  }
  if (p.phase === 'processing') return '文件处理中，请稍候...'
  if (p.phase === 'submitting') return '正在提交...'
  return '正在提交中，请耐心等待...'
})

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

/** 打开图片选择框 */
const openImagePicker = () => {
  if (imageInputRef.value) imageInputRef.value.click()
}

/** 打开视频选择框 */
const openVideoPicker = () => {
  if (videoInputRef.value) videoInputRef.value.click()
}

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
const onSelectImages = async (e) => {
  const files = Array.from(e?.target?.files || [])
  if (!files.length) return

  const existed = new Set(imageFiles.value.map((f) => getFileKey(f)))
  const merged = [...imageFiles.value]
  const added = []
  for (const f of files) {
    const key = getFileKey(f)
    if (!existed.has(key)) {
      merged.push(f)
      added.push(f)
      existed.add(key)
    }
  }
  imageFiles.value = merged

  if (imageInputRef.value) {
    imageInputRef.value.value = ''
  }
}

/** 选择视频（最多5个） */
const onSelectVideos = async (e) => {
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
const removeImage = async (file) => {
  revokePreviewUrl(file)
  const key = getFileKey(file)
  imageFiles.value = imageFiles.value.filter((f) => getFileKey(f) !== key)
}

/** 删除已选视频 */
const removeVideo = async (file) => {
  revokePreviewUrl(file)
  const key = getFileKey(file)
  videoFiles.value = videoFiles.value.filter((f) => getFileKey(f) !== key)
}

/** 提取接口错误信息 */
const getErrorMessage = (err) => {
  const msg = err?.response?.data?.message
  if (Array.isArray(msg)) return msg.join('\n')
  if (typeof msg === 'string' && msg.trim()) return msg
  if (typeof err?.message === 'string' && err.message.trim()) return err.message
  return '提交失败'
}

/** 提交表单 V2：验证码 → 逐个上传文件 → 提交 */
const submitFormV2 = async () => {
  if (isSubmitting.value) return
  if (!formData.value.nickname?.trim()) { alert('请填写昵称'); return }
  if (!formData.value.question?.trim()) { alert('请填写详细问题'); return }
  if (!captcha.value.captchaId) { alert('验证码加载失败，请刷新'); return }
  if (!captchaInput.value?.trim()) { alert('请输入验证码'); return }

  isSubmitting.value = true
  uploadProgress.value = { phase: 'verifying', current: 0, total: 0, fileName: '', percent: 0 }

  try {
    // Step 1: 校验验证码，获取 uploadToken
    const captchaRes = await api.post('/issue/verify-captcha', {
      captchaId: captcha.value.captchaId,
      captcha: captchaInput.value,
    })
    // 响应拦截器已解包：captchaRes 直接是后端 data 字段
    const uploadToken = captchaRes?.uploadToken
    if (!uploadToken) throw new Error('验证码校验失败')

    // Step 2: 逐个上传文件
    const allFiles = [...imageFiles.value, ...videoFiles.value]
    const pendingFileIds = []

    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i]
      uploadProgress.value = {
        phase: 'uploading',
        current: i + 1,
        total: allFiles.length,
        fileName: file.name,
        percent: 0,
      }

      const fd = new FormData()
      fd.append('file', file)

      const uploadRes = await api.post('/issue/upload-file', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-upload-token': uploadToken,
        },
        timeout: 0,
        onUploadProgress: (evt) => {
          if (evt.total) {
            uploadProgress.value.percent = Math.round((evt.loaded / evt.total) * 100)
          }
        },
      })
      // 响应拦截器已解包：uploadRes 直接是后端 data 字段
      pendingFileIds.push(uploadRes?.pendingFileId)
    }

    // Step 3: 提交（若 409 则轮询重试）
    uploadProgress.value = { phase: 'submitting', current: 0, total: 0, fileName: '', percent: 0 }

    const MAX_RETRY = 60
    let retryCount = 0
    let submitRes = null

    while (retryCount <= MAX_RETRY) {
      try {
        submitRes = await api.post(
          '/issue/submit-v2',
          {
            nickname: formData.value.nickname,
            question: formData.value.question,
            pendingFileIds,
          },
          { headers: { 'x-upload-token': uploadToken }, skipErrorCodes: [409] },
        )
        break
      } catch (err) {
        if (err?.response?.status === 409 && retryCount < MAX_RETRY) {
          uploadProgress.value.phase = 'processing'
          retryCount++
          await new Promise((resolve) => setTimeout(resolve, 2000))
          uploadProgress.value.phase = 'submitting'
        } else {
          throw err
        }
      }
    }

    void submitRes
    const hasFiles = allFiles.length > 0
    alert(hasFiles ? '提交成功！图片/视频正在后台处理，稍后可在结果页查看。' : '提交成功！')
    formData.value = { nickname: '', question: '' }
    clearAllPreviewUrls()
    imageFiles.value = []
    videoFiles.value = []
    if (imageInputRef.value) imageInputRef.value.value = ''
    if (videoInputRef.value) videoInputRef.value.value = ''
    await refreshCaptcha()
  } catch (err) {
    alert(getErrorMessage(err))
    await refreshCaptcha()
  } finally {
    isSubmitting.value = false
    uploadProgress.value = { phase: 'idle', current: 0, total: 0, fileName: '', percent: 0 }
  }
}

/** 提交表单（旧版，保留兼容）：视频先传完再一次性提交 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const fd = new FormData()
    fd.append('nickname', formData.value.nickname)
    fd.append('question', formData.value.question)
    fd.append('captchaId', captcha.value.captchaId)
    fd.append('captcha', captchaInput.value)
    imageFiles.value.forEach((f) => fd.append('images', f))
    videoFiles.value.forEach((f) => fd.append('videos', f))

    const submitRes = await api.post('/issue/submit', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0
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
    alert(getErrorMessage(err))
    await refreshCaptcha()
  } finally {
    isSubmitting.value = false
  }
}

marked.setOptions({ gfm: true, breaks: true })

const tipsText = ref(`
 由于每个梦战版本都会出现很多小小细节的问题与经验结论，微信公众号后台又没法及时收到消息，所以本人墨源开放了一个提交窗口，经验证后会公开给全服玩家查看。 

如果你原意的话，你可以提交：
 1.近期实战发现的非常有意义的现象（如大表哥开3C再动不能锁住天赋剑域；大表哥射程buff被驱散后，四格打不出手；） 
 2.疑是BUG的问题，描述清楚你发现了什么，是体验服还是正式服（此类一定要带上图或视频，或者把战报挂到名片上留言哪个服务器ID多少，最好带上联系方式或直接加VX：moyuan0719直接沟通，否则光文字说明无法进行验证） 
 3.计算上的验证问题（此类一定要带上图或视频，或者把战报挂到名片上留言哪个服务器ID多少，最好带上联系方式或直接加VX：moyuan0719直接沟通，否则光文字说明无法进行验证） 
 4.其他一些机制上的疑问，或每次大版本更新需要提醒体验服测试的问题 

不接收处理非定性问题：
1.抽卡养成问题不处理（雅希抽不抽？大表哥要不要SP？）
2.配装和附魔问题不处理（老泰附魔什么？大表哥穿什么装备？穆宁转什么职业？）
3.帮计算的问题不处理（索尼娅能杀老泰吗？）
4.PVE类问题不处理（不玩PVE，你只能反馈给百科）
 5.骚扰类问题不处理（别尝试了，我的AI会直接洗掉这类问题，根本收不到，你也浪费不了我的token） 

问题处理结果查看
 https://my.feishu.cn/wiki/CncJwLteQi7gGikyNsLc8jzOnmM?from=from_copylink 
梦战近期热点结论（看一看，巅峰失误少一半）
 https://my.feishu.cn/wiki/Du82wwfKpi5RjYkXnqVcQ2q8nJc
梦战每日日报合集
https://my.feishu.cn/wiki/SW9cwedagi4ZPxks1Zncq000nGh
梦战攻略飞书首页
https://my.feishu.cn/wiki/X7uawMSS8iJenIkRxyMc8VGbnjf
梦战计算器（网页版）
https://maiyaoqiang.fun（小程序版本可在VX小程序搜“梦战伤害计算器”）

QQ交流群：825591295
VX交流群：加moyuan0719备注拉梦战群
微信公众号：墨源的梦战科普（moyuanmz）
B站：墨_源

AI解答梦战问题
https://yuanbao.tencent.com/chat/u4aJAFfJ0stG?spaceId=spOhvkEelOPF

感谢您的支持！


`)

/**
/** 提示文案Markdown渲染结果 */
const tipsHtml = computed(() => marked.parse(tipsText.value || ''))

onMounted(() => {
  refreshCaptcha()
})
</script>

<template>
  <div class="mobile-form-container">
    <div v-if="isSubmitting" class="submit-mask">
      <div class="submit-mask-content">
        {{ maskMessage }}<span class="submit-dots">...</span>
      </div>
    </div>
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
        <button class="pick-btn" type="button" :disabled="isSubmitting" @click="openImagePicker">
          选择图片
        </button>
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
        <button class="pick-btn" type="button" :disabled="isSubmitting" @click="openVideoPicker">
          选择视频
        </button>
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

      <button class="submit-btn" @click="submitFormV2">
        {{ isSubmitting ? '提交中...' : '提交' }}
      </button>

      
    </div>
    <div class="tips-box">
      <div class="tips-markdown" v-html="tipsHtml"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
div{
    box-sizing: border-box;
}
.submit-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
}

.submit-mask-content {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  font-size: 16px;
  font-weight: 600;
  padding: 16px 18px;
  border-radius: 12px;
  max-width: 320px;
  text-align: center;
}

.submit-dots {
  display: inline-block;
  width: 0;
  overflow: hidden;
  vertical-align: bottom;
  animation: submitDots 1.2s steps(4, end) infinite;
}

@keyframes submitDots {
  to {
    width: 1.3em;
  }
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

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
    margin-top: 0;
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
  display: none;
}

.pick-btn {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.pick-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.tips-box {
  width: 100%;
  max-width: 400px;
  margin-top: 18px;
  padding: 16px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  background: #fafafa;
}

.tips-markdown {
  font-size: 13px;
  color: #444;
  line-height: 1.7;
}

:deep(.tips-markdown p) {
  margin: 0 0 10px 0;
}

:deep(.tips-markdown p:last-child) {
  margin-bottom: 0;
}

:deep(.tips-markdown ol),
:deep(.tips-markdown ul) {
  margin: 0 0 10px 0;
  padding-left: 18px;
}

:deep(.tips-markdown li) {
  margin: 4px 0;
}

:deep(.tips-markdown a) {
  color: #667eea;
  text-decoration: underline;
  word-break: break-all;
}
</style>
