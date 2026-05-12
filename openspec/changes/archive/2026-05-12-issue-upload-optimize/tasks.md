## 1. Nginx 配置确认

- [x] 1.1 确认当前 Nginx 配置已有 `client_max_body_size 300m`、`proxy_read_timeout 600s`，无需修改（已满足需求）

## 2. 后端 - IssueModule 注入 JwtModule

- [x] 2.1 在 `langrissar-server/src/issue/issue.module.ts` 中 import `JwtModule.register({ secret: process.env.JWT_SECRET || 'langrissar-secret-key', signOptions: { expiresIn: '10m' } })`

## 3. 后端 - DTO 新增

- [x] 3.1 新增 `langrissar-server/src/issue/dto/verify-captcha.dto.ts`，包含 `captchaId: string`、`captcha: string` 字段（IsString + IsNotEmpty）
- [x] 3.2 新增 `langrissar-server/src/issue/dto/submit-v2-issue-feedback.dto.ts`，包含 `nickname`、`question`、`pendingFileIds?: string[]` 字段

## 4. 后端 - IssueService 新增方法

- [x] 4.1 在 `IssueService` 中注入 `JwtService`，新增 `pendingUploads` Map（存储 `pendingFileId → { status, url?, error?, promise, createdAt }`）
- [x] 4.2 实现 `verifyCaptchaAndGetToken(dto)` 方法：调用 `userService.consumeCaptchaOrThrow`，签发 uploadToken JWT，返回 `{ uploadToken }`
- [x] 4.3 实现 `uploadFile(uploadToken, file)` 方法：验证 JWT，写入临时目录，生成 pendingFileId，启动异步飞书上传，立即返回 `{ pendingFileId, status: 'uploading' }`
- [x] 4.4 实现异步飞书上传逻辑：上传完成后更新 pendingUploads 对应条目 status/url，失败时更新 status/error
- [x] 4.5 实现 `submitV2(uploadToken, dto)` 方法：验证 JWT，检查所有 pendingFileId 状态——若有任意一个仍为 uploading，立即返回 HTTP 409（"文件仍在处理中，请稍后再试"）；若有 error，返回 HTTP 400；全部 done 后收集 imageUrls/videoUrls，落库，通知 Coze
- [x] 4.6 实现 pendingUploads 定时清理（30 分钟 TTL），使用 `setInterval` 在构造函数中启动

## 5. 后端 - IssueController 新增接口

- [x] 5.1 在 `issue.controller.ts` 中新增 `POST /issue/verify-captcha`（`@Public()`），调用 `issueService.verifyCaptchaAndGetToken`
- [x] 5.2 新增 `POST /issue/upload-file`（`@Public()`），使用 `FileInterceptor('file', { limits: { fileSize: 200MB }, storage: diskStorage(...) })`，调用 `issueService.uploadFile`，从 Header `x-upload-token` 或 Body 读取 uploadToken
- [x] 5.3 新增 `POST /issue/submit-v2`（`@Public()`），接收 JSON body（无文件），调用 `issueService.submitV2`

## 6. 前端 - issues.vue 新增分步上传逻辑

- [x] 6.1 新增上传进度状态：`uploadProgress: { current: number, total: number, fileName: string, percent: number, phase: 'idle'|'uploading'|'processing'|'submitting' }`
- [x] 6.2 新增 `submitFormV2()` 方法，实现分步流程：① 校验表单 → ② 调用 `/issue/verify-captcha` 获取 uploadToken → ③ 逐个上传文件（axios onUploadProgress 更新进度）→ ④ 调用 `/issue/submit-v2` 提交
- [x] 6.3 更新提交按钮点击事件调用 `submitFormV2()`（原 `submitForm` 保留但不再绑定按钮）
- [x] 6.4 更新遮罩层文案，根据 `uploadProgress.phase` 显示不同状态：上传中显示"正在上传第 N/M 个文件（文件名）... XX%"，处理中显示"文件已上传，正在处理中..."，提交中显示"正在提交..."
- [x] 6.5 提交成功后，在 alert 中增加提示："提交成功！图片/视频正在后台处理，稍后可在结果页查看。"（仅当有文件时显示）
- [x] 6.6 若 submit-v2 返回 409（文件处理中），前端自动轮询重试（每 2 秒一次，最多 60 次），期间遮罩显示"文件处理中，请稍候..."
